# 01 — How Modern Software Products Work

**Status:** v1.0 · 31 August 2026
**Experiment:** `experiments/01-request-response-app` ("Deskline")

---

```
LEARNING PATH

LEARN     MDN on HTTP methods, status codes, form validation and cookies
          (S-022 … S-026) · Node docs for the runtime we actually use (S-027)
WATCH     V-005 What Is an API? (IBM, 2026) · V-006 What is a REST API? (IBM, 2020)
BUILD     Deskline — a signed-in user asks a question and it is saved
TEST      25 deterministic cases, written before the code existed
BREAK     invalid input · bypassed browser · unknown route · server exception ·
          data-store outage · rate limit · 600ms of latency · a real restart
REFLECT   what each mechanism forces the interface to do
```

---

## 1. The problem

You have designed products for fifteen years. You know what a good loading state
is. You have argued for error messages that say what to do next. You have shipped
things people use.

And there is a conversation you have had more than once that goes like this:

> "Can we show the results as they come in?"
> "Not really — it's one call."
> "What if we saved a draft automatically?"
> "That's a bigger change than it sounds."

You can tell the answer is real. You cannot tell *why* it is real, which means
you cannot tell when it is real and when it is a preference wearing a technical
costume. You cannot propose the alternative that would have been cheap, because
you do not know which alternatives are cheap.

This chapter is about closing that gap — not by learning to build software, but
by learning to **trace** it. By the end you will be able to take a feature, follow
one click through every part of the machine, and say where the thing you want
would have to happen and what it would cost.

That skill is the foundation for everything after it. When Chapter 04 has you
calling a model API, you will already know what a request is. When Chapter 12
covers prompt injection, you will already know what "untrusted input" means,
because you will have sent some yourself.

## 2. Why a Product Designer should care

Three specific returns.

**You stop losing arguments you should win.** "The server can't do that" is
sometimes true and sometimes a habit. Knowing the difference is worth more than
knowing how to code.

**You start designing the 80% of states nobody designs.** Every product has a
success state, and every designer designs it. Loading, empty, error, expired,
forbidden, rate-limited, offline — these come *from the machine*, and if you
cannot see the machine you cannot see them coming. By the end of this chapter you
will have a list of failure states derived from architecture rather than from
imagination.

**You get access to the constraints early.** The best time to learn that a
browser cannot safely hold an API key is before you have designed the flow that
assumes it can. That specific constraint reappears in Chapter 04 and shapes the
architecture of every AI product.

## 3. The product we will follow

One product, all the way through. It is called **Deskline** and it does one
thing:

> A user signs in, types a question, sends it, and sees it saved in their own
> list.

That is it. No AI — deliberately. Chapter 04 introduces a model, and a model's
output is *probabilistic*: the same input can produce different results, and
there is no single correct answer to compare against. Adding that on top of a
system you do not yet understand means every problem has two possible homes, and
you will guess wrong.

So: a boring, deterministic product first. When it misbehaves, something is
wrong. That clarity is worth protecting.

The whole thing is about 400 lines and installs nothing.

---

## 4. Follow one click

Here is the entire journey. The user has typed a question and pressed **Send**.

We will walk it once quickly, then go back and open each part.

```
   USER clicks Send
     │
  ①  browser fires an event                     ┐
  ②  our code reads the textarea                │  in the browser,
  ③  our code checks the input                  │  on the user's machine
  ④  the UI switches to a loading state         ┘
     │
  ⑤  a request is built
     │
     ══════════ ⑥ ACROSS THE NETWORK ══════════
     │
  ⑦  the server receives it                     ┐
  ⑧  it reads the cookie → who is this?         │
  ⑨  it parses the body                         │  on a machine
  ⑩  it validates — again, and for real         │  we control
  ⑪  application logic runs                     │
  ⑫  the database writes a row                  │
  ⑬  a response is built                        ┘
     │
     ══════════ back across the network ═══════
     │
  ⑭  our code reads the status                  ┐
  ⑮  client state changes                       │  back in
  ⑯  the UI re-renders                          │  the browser
     │                                          │
  ⑰  the server writes a log line               ┘ (independently)
     ▼
   USER sees the result
```

Seventeen steps for one click. Every one of them can fail, and eleven of them can
fail in a way the user has to be told about.

---

## 5. In the browser: client, runtime, and why "client" is a place

Steps ① to ⑤ happen on the user's computer.

**The browser** is a *runtime* — a program whose job is to run other programs. It
downloads our HTML, CSS and JavaScript and executes them inside a sandbox on the
user's machine. It is the environment our client code lives in.

**The client** is our code that runs there: `index.html`, `app.js`, `style.css`.

**The server** is our code that runs on a machine we control.

Here is the thing worth pausing on, because it is the most common
misunderstanding. In Deskline, **the client and the server are written in the same
language**. Both are JavaScript. Both use `fetch`-shaped ideas. Some of the code
looks nearly identical.

That was a deliberate choice when building the experiment. If the two sides were
different languages, you would learn "client = JavaScript, server = Python", which
is false and would need unlearning. They are the same language here, so the only
thing left to distinguish them is the thing that actually distinguishes them:

> **Client and server are not two technologies. They are two locations.**
> The difference is whose machine the code is running on — and therefore who can
> change it.

That has an immediate consequence, and it is step ③.

### ③ Validation in the browser: real value, zero authority

Deskline requires a question to be at least 10 characters. The client checks
this:

```js
function validate(text) {
  const t = text.trim();
  if (t.length === 0) return 'Please write your question first.';
  if (t.length < MIN_LEN) return `Please write at least ${MIN_LEN} characters.`;
  if (t.length > MAX_LEN) return `Please keep it under ${MAX_LEN} characters.`;
  return null;
}
```

Type `hi`, press Send, and you get *"Please write at least 10 characters."*
instantly. Watching the network while doing that, this is the complete list of
requests the page has made:

```
GET  /api/me         → 401 Unauthorized     (page load, before signing in)
POST /api/session    → 201 Created          (signing in)
GET  /api/questions  → 200 OK               (loading the list)
```

**No request was sent for the invalid question.** That is the value: the user
found out in about five milliseconds, without a round trip, without losing what
they typed.

MDN puts the benefit precisely:

> "Client-side validation is an initial check and an important feature of good
> user experience; by catching invalid data on the client-side, the user can fix
> it straight away."

And then, immediately, the limit:

> **"Never trust data passed to your server from the client. Even if your form is
> validating correctly and preventing malformed input on the client-side, a
> malicious user can still alter the network request."**

— MDN, *Client-side form validation* (S-025)

This is not a caution about hackers. It is a statement about **where code runs**.
Our validation function is on the user's machine. They can open the developer
console and simply not call it:

```js
await fetch('/api/questions', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ text: 'hi' }),
});
```

That is not an attack. It is three lines any developer types a hundred times a
week, and it never touches our form, our button or our validation function.

Running exactly that against Deskline:

| Sent from the console | Status | Error code |
|---|---|---|
| `{ text: "hi" }` | `400` | `TEXT_TOO_SHORT` |
| `{ text: 12345 }` | `400` | `TEXT_NOT_STRING` |
| `{}` | `400` | `TEXT_REQUIRED` |

The server enforced all three. The second row is the one to sit with: **a form
cannot put a number in a text field.** Only a script can. And the server still
has to handle it, because a form is not the only thing that can send a request.

So the rule, in one line each:

> **Client validation is a kindness. Server validation is the system's
> correctness.**
> They usually check the same things, for entirely different reasons, and only
> one of them can be removed without breaking the product.

`[Design interpretation]` **The product consequence.** These two checks fail
differently, and the interface should treat them differently. A client-side
failure is *prevention* — inline, instant, next to the field, nothing lost. A
server-side failure is *recovery* — it means a request went out and came back
refused, so the interface must restore the user's work and explain. In Deskline
the field error appears under the textarea and the server error appears under the
button. They look different because they mean different things.

### ④ The loading state, and the exactly-one moment it can exist

```js
state.submitting = true;
render();                     // ← the loading state goes up HERE
setStatus('Sending your question…');

try {
  const saved = await api('POST', '/api/questions', { text });
  ...
} finally {
  state.submitting = false;   // ← and comes down HERE, on success OR failure
  render();
}
```

The loading state is raised **before** the request and cleared in a `finally`
block. Both details matter.

Raised before, because the window in which a loading state can do any good is the
window between sending and receiving. Cleared in `finally`, because `finally`
runs whether the request succeeded or blew up — a spinner cleared only in the
success branch is a spinner that spins forever on the day something goes wrong.

Measured, on a server deliberately slowed by 600ms:

| | at ~250 ms | at ~1200 ms |
|---|---|---|
| Button label | `Sending…` | `Send` |
| Button disabled | `true` | `false` |
| Status region | "Sending your question…" | "Saved." |
| Questions in the list | `0` | `1` |

Note the last row. The list changes **after the server confirms**, not when the
button is clicked.

`[Design interpretation]` That was a decision, and the alternative has a name.
**Optimistic UI** adds the item immediately and assumes it will work — faster,
smoother, and wrong on the day the write fails, when you must silently remove
something the user watched appear. Deskline is pessimistic because a lost
question is worse than a slow one. **That is a product judgement about the cost
of being wrong, not a technical constraint** — and now you can make it on
purpose.

---

## 6. ⑥ The network: one line, and where the difficulty lives

Look back at the trace. Exactly one step crosses a network. Everything else is a
function calling another function inside one program.

That single arrow is where **latency**, **failure**, **untrusted input** and
**interception** all enter the system. Most of what makes software hard is a
consequence of one line in the diagram.

What actually travels:

```http
POST /api/questions HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Cookie: sid=9f3c1a…
Content-Length: 48

{"text":"How do I roll back a deploy?"}
```

Four parts, and they are worth naming because you will see them for the rest of
your career.

**Method** — `POST`. What kind of operation this is.
**URL / path** — `/api/questions`. What it concerns.
**Headers** — metadata *about* the request: what format the body is in, who is
asking. Not the content; the label on the envelope.
**Body** — the content itself, here as JSON.

### HTTP, at the depth that is actually useful

**HTTP** is the agreement both sides follow so this works at all: request goes
one way, response comes back, here is where the method goes, here is where the
body goes.

The property that shapes everything downstream:

> `[Documented behaviour]` "by default the HTTP protocol is stateless."
> — MDN, *Using HTTP cookies* (S-026)

**Stateless** means each request arrives knowing nothing about any previous one.
The server has no memory of you between requests. That is not a limitation to
work around; it is why servers can scale, and it is the reason sessions exist at
all. We come back to it in §9.

**JSON** is just a text format for structured data — objects, arrays, strings,
numbers — that both sides can parse. Nothing more. `{"text":"..."}` is a string
until someone parses it into a value.

### Methods

`[Documented behaviour]` MDN's definitions:

| Method | MDN's definition | In Deskline |
|---|---|---|
| **GET** | "requests a representation of the specified resource" — should "only retrieve data" | Load the list, read one question |
| **POST** | "submits an entity to the specified resource, often causing a change in state or side effects on the server" | Ask a question; sign in |
| **PUT** | "replaces all current representations of the target resource" | *not used* — would replace a whole question |
| **PATCH** | "applies partial modifications to a resource" | *not used* — would edit just the text |
| **DELETE** | "deletes the specified resource" | Sign out |

— MDN, *HTTP request methods* (S-022)

Two properties MDN names are worth carrying:

**Safe** — does not change anything. `GET` is safe; `POST`, `PUT`, `PATCH` and
`DELETE` are not.
**Idempotent** — doing it five times leaves the same result as doing it once.
`GET`, `PUT` and `DELETE` are idempotent. **`POST` is not.**

`[Design interpretation]` That last fact is a design brief. `POST` is not
idempotent, which is exactly why double-clicking Send can create two questions,
and why Deskline disables the button while a request is in flight. The disabled
button is not politeness — it is compensating for a property of the method.
Retry-on-timeout has the same problem: was the first one saved or not?

### Status codes: the response's first word

`[Documented behaviour]` MDN's five families:

| Range | MDN's name | Read it as |
|---|---|---|
| 100–199 | Informational responses | rarely seen |
| **200–299** | **Successful responses** | it worked |
| 300–399 | Redirection messages | it lives elsewhere |
| **400–499** | **Client error responses** | *the request* was wrong |
| **500–599** | **Server error responses** | *we* were wrong |

— MDN, *HTTP response status codes* (S-023)

The 4xx / 5xx split is the one to internalise, because it decides who apologises.
**4xx: the request was wrong** — the user or the client can fix it. **5xx: we
were wrong** — nothing the user does will help, and telling them to "check your
input" is a lie.

The eight that matter here, all of them observed in a real run:

| Code | MDN's definition | Deskline sends it when | The user sees |
|---|---|---|---|
| **200** OK | "The request succeeded." | The list or a question is read | Their content |
| **201** Created | "The request succeeded, and a new resource was created as a result." | A question is saved | "Saved." |
| **400** Bad Request | "The server cannot or will not process the request due to something that is perceived to be a client error" | Text too short, wrong type, unparseable JSON, malformed id | The specific problem, text preserved |
| **401** Unauthorized | "a request was not successful because it lacks valid authentication credentials" | No session, or an unrecognised one | Dropped to signed-out: "Your session ended." |
| **403** Forbidden | "The client does not have access rights to the content" | Reading someone else's question | "That question belongs to someone else." |
| **404** Not Found | "The server cannot find the requested resource." | No such question; no such route | "No question with that id." |
| **429** Too Many Requests | "The user has sent too many requests in a given amount of time (rate limiting)." | Sixth question in a minute | "Try again in a minute." |
| **500** Internal Server Error | "The server has encountered a situation it does not know how to handle." | A bug, or the database is gone | "We could not save it. Nothing was lost." |

`201` rather than `200` for a save is a small thing that pays off: the response
says *something now exists that did not exist before*, which is exactly what the
client needs to know to add it to a list.

### 401 is not 403, and the difference is a design decision

These two are confused constantly — including, mildly, by MDN itself, whose 403
page says the client "is unauthorized", using the word that names the *other*
code. Its 401 page draws the line cleanly:

> `[Documented behaviour]` "A `401 Unauthorized` is similar to the `403
> Forbidden` response, except that a 403 is returned when a request contains
> valid credentials, but the client does not have permissions to perform a
> certain action."
> — MDN, *401 Unauthorized* (S-024)

In plain terms:

| | **401** | **403** |
|---|---|---|
| The question | *Who are you?* | *Are you allowed?* |
| What went wrong | We do not know you | We know you perfectly well |
| Can the user fix it? | **Yes** — sign in | **No** — signing in again changes nothing |
| The right UI | A sign-in path | An explanation, and somewhere else to go |

Deskline produces both, from the same endpoint:

```js
// 401 — no identity arrived with this request
if (!session) return fail(res, 401, 'NOT_SIGNED_IN', 'Please sign in.');

// ... later, after the record is found ...

// 403 — identity arrived, is valid, and is not allowed to have this
if (q.user_id !== session.userId) {
  return fail(res, 403, 'FORBIDDEN', 'That question belongs to someone else.');
}
```

`[Design interpretation]` **Why this is a design problem and not a technical
one.** These two codes need completely different screens. A 401 screen offers a
way back in and should preserve what the user was doing. A 403 screen must not —
offering "sign in again" to someone already signed in sends them round a loop
that cannot succeed. Products that show one screen for both produce the most
demoralising experience in software: signing in repeatedly to reach something you
were never going to be allowed to see.

A third distinction is worth having, and Deskline enforces it:

- `GET /api/questions/999999` → **404**. That id could exist. It does not.
- `GET /api/questions/abc` → **400**. That id could never exist.

Collapsing them into one code throws away information the interface needs.
"We couldn't find that" and "that link is malformed" are different messages.

Chapter 11 goes deep on identity and permission. This is the preview: **401 is
authentication, 403 is authorization, and they are not the same failure.**

---

## 7. ⑦–⑬ On the server

The request arrives. Here is the order Deskline does things in, and the order is
itself a design.

```js
①  parse the cookie → look up the session
②  no session?              → 401
③  over the rate limit?     → 429
④  parse the JSON body      → 400 if unparseable
⑤  validate the content     → 400
⑥  application logic
⑦  write to the database
⑧  build the response       → 201
```

**Identity first.** We do not tell an anonymous caller whether their data would
have been valid. Answering "your text is too short" to someone who has not signed
in confirms the endpoint exists and reveals how it behaves.

**Rate limit before validation.** This looks wrong and is not. If invalid
requests were free, the limit would protect nothing — anyone could send unlimited
malformed requests and the server would do the work of rejecting each one.

That ordering caused three test failures, and the tests were the thing that was
wrong. The full story is `failures.md`, F-01.

### An endpoint, an API, a contract

An **endpoint** is one address that accepts one kind of request:
`POST /api/questions` is an endpoint. `GET /api/questions` is a different one at
the same path — the method is part of the identity.

An **API** — *application programming interface* — is the set of endpoints plus
the agreement about how to use them. It is how one program uses another **without
knowing how it works inside**. The client knows `POST /api/questions` with
`{text}` returns `201` and a question object. It does not know there is a SQLite
file behind it, and it does not need to.

That agreement is the **contract**, and it has four parts:

| | Deskline's `POST /api/questions` |
|---|---|
| **Input** | JSON `{ text: string, 10–500 chars }`, plus a session cookie |
| **Output** | `201` + `{ id, user_id, text, created_at }` |
| **Errors** | `400` (with a code) · `401` · `429` · `500` |
| **Change implications** | see below |

That last row is where products break. If the server started requiring 20
characters, every client built against "10" breaks. If `id` became a string,
code doing arithmetic on it breaks. This is why APIs get **versioned** — `/v1/`,
`/v2/` — so old clients keep working while new ones move on.

`[Design interpretation]` A designer meets this as *"we can't change that field,
the mobile app depends on it."* That is not obstruction. Somewhere a client is
built against a promise, and the promise cannot be quietly withdrawn — mobile
apps especially, because the old version stays installed on real phones for
months.

Deskline's error shape is a small contract decision worth copying:

```json
{ "error": "TEXT_TOO_SHORT", "message": "Please write at least 10 characters." }
```

The `error` code is stable and machine-readable; the client switches on it. The
`message` is for humans and can be reworded. A UI that has to string-match on
prose is a UI that breaks the day someone improves the copy.

### Internal and external APIs — and the bridge to everything after this

`/api/questions` is an **internal API**: we wrote both sides, we control both,
they change together.

An **external / third-party API** belongs to someone else. You did not write it,
cannot change it, do not control its uptime, and it may charge you. Deskline has
none — deliberately, so its absence is visible.

**And here is the bridge this chapter exists to build.**

In Chapter 04 you will call a language model. That will feel like a new kind of
thing. It is not:

```
Deskline's client → HTTP request with a JSON body → server → response

Your server      → HTTP request with a JSON body → Anthropic → response
```

Same mechanism. Same methods, same status codes, same headers, same JSON, same
`429` when you send too many. A `401` from a model API means your key is wrong;
a `500` means their problem, not yours; a timeout means the same thing it means
here.

**Calling an LLM is one software system making an HTTP request to another.** What
is genuinely new in Chapter 04 is not the plumbing — it is that the response body
is *probabilistic*, so the same request can return different content and there is
no single correct answer to compare it against. That is why evaluation gets its
own chapter at 03, before you ever make that call.

If you can trace Deskline, you can trace a model call. That is the point of this
chapter.

### ⑦ The database, and why persistence is a design concern

The server needs somewhere to put the question so it is still there tomorrow.
That is **persistence**, and it is the whole job of a database.

The mental model, and this is as deep as Chapter 01 goes:

| Term | What it means | In Deskline |
|---|---|---|
| **Record / row** | One thing | One question |
| **Table** | All things of one shape | `questions` |
| **ID** | The system's name for one record — assigned by the database, not the user | `id INTEGER PRIMARY KEY` |
| **Write** | Put something in | `INSERT` when a question is asked |
| **Read** | Get something out | `SELECT` when the list loads |
| **Update** | Change an existing record | not used here |
| **Delete** | Remove one | not used here |
| **Query** | A question asked of the data | "all questions belonging to ana, newest first" |

Deskline's whole table:

```sql
CREATE TABLE questions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL,
  text       TEXT NOT NULL,
  created_at TEXT NOT NULL
)
```

Four columns, and `user_id` is doing more work than it looks like. **It is the
column that makes "someone else's question" a concept the system can have.**
Without it, there is no 403 to return, because there is no way to know a record
belongs to anyone. Ownership is not a UI feature. It is a column.

`[Design interpretation]` This has a direct product consequence. Whenever a
design says "users can share this" or "admins can see everyone's", somebody has
to add or change a column, and the query behind every screen that touches it has
to change too. That is why "just let managers see their team's questions" is
never a small request — the visibility rule lives in the data, not the interface.

The query for the list:

```sql
SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC
```

`WHERE user_id = ?` is the authorization boundary for the entire list screen. A
list endpoint that forgets that clause returns everyone's data with a cheerful
`200` and looks perfectly healthy while doing it. Test `T-15` exists for exactly
this reason.

The `?` is not decoration either. The value is passed separately from the SQL
rather than glued into the string, so user input is treated as a value and never
as an instruction. Chapter 12 covers the attack that prevents. The habit starts
now because retrofitting it means auditing every query you ever wrote.

---

## 8. State: the most important section in this chapter

If you take one thing from Chapter 01, take this.

There are several completely different kinds of "the system knows something", and
they have different lifespans. Confusing them is behind a large share of the bugs
users actually notice.

| What | Where it lives | Survives a refresh? | Survives closing the browser? | Survives a server restart? |
|---|---|---|---|---|
| The list on screen (`state.questions`) | Browser tab memory | **No** | No | n/a — refetched |
| The loading flag (`state.submitting`) | Browser tab memory | **No** | No | n/a |
| The session cookie | Browser cookie jar | Yes | Yes | Yes — but see below |
| The session *record* | **Server memory** | Yes | Yes | **No** |
| The questions | **A file on disk** | Yes | Yes | **Yes** |

### Client state is a *belief*, not the truth

`state.questions` in `app.js` is this tab's current belief about what the server
holds. It can be stale — someone else may have changed things. It can be wrong —
a failed write leaves the screen showing something that was never saved. It is
gone on refresh, which is why Deskline refetches on load.

> **"The interface currently shows it" and "the system stored it" are different
> claims.**

Optimistic UI is precisely the decision to let them differ for a moment, on
purpose, in exchange for speed. That is a legitimate trade — but it is a trade,
and it needs a plan for the moment the write fails.

### The restart pair

This is the experiment's sharpest result, and it took two attempts to get honest
evidence for it.

Two genuinely separate processes: start the app, save a question, **kill the
process**, start it again against the same database file.

```
old cookie → GET /api/questions   →  401     the session did NOT survive
new sign-in → GET /api/questions/7 →  200     the question DID survive
```

Same restart. Two opposite outcomes. The difference is not luck and not
complexity — it is **where each thing was kept**. Sessions were in a `Map` in the
process's memory, which stopped existing. Questions were in a file, which did not.

`[Design interpretation]` **What the user experiences.** They come back to the
tab. Their question is still there — good. But they are signed out, mid-task, for
no reason they can see. This is the "session expired" interruption, and now you
know it is not a bug and not a policy. It is the direct consequence of a storage
decision somebody made.

Which means it is negotiable. Sessions kept in a database instead of memory
survive restarts. That costs a lookup on every request. **A UX complaint about
being logged out is a conversation about where session state lives** — and now
you can have that conversation.

`[Our observation]` The first version of that test *passed while proving
nothing*. It "restarted" the server by closing and reopening it inside one
process — which does not clear the process's memory, so the session survived and
the test reported `200`. It caught the mistake only because the expected result
(`401`) had been written down **before** the run, in `eval/test-set.md`, and could
not be quietly adjusted to match what happened. Written up as F-04.

That is the handbook's central rule arriving in Chapter 01, uninvited:
**a passing test tells you the cases you wrote did not fail. It does not tell you
they described what you thought they described.**

---

## 9. ⑧ Session, authentication, authorization — the preview

HTTP is stateless. Every request arrives with no memory of the last one. So how
does the server know it is still you?

It doesn't — unless you tell it, every single time.

**Signing in.** The server creates a random token, stores `token → ana`, and
sends the token back as a cookie:

```
Set-Cookie: sid=9f3c1a…; HttpOnly; SameSite=Strict; Path=/
```

**Every request after that.** The browser attaches the cookie automatically. The
server reads it, looks up the token, and knows who is asking.

That loop is a **session**: the server's way of recognising you across requests
that individually remember nothing.

Three words, three questions:

> **Authentication** — *who are you?* → 401 when it fails
> **Authorization** — *what are you allowed to do?* → 403 when it fails
> **Session** — *how does the system remember the answer across requests?*

`HttpOnly` is worth one line now:

> `[Documented behaviour]` "A cookie with the `HttpOnly` attribute can't be
> accessed by JavaScript… Cookies that persist user sessions for example should
> have the `HttpOnly` attribute set — it would be really insecure to make them
> available to JavaScript."
> — MDN, *Using HTTP cookies* (S-026)

Verified in the running app: `document.cookie` returns an empty string while
signed in, and the cookie is nonetheless sent on every request. The browser holds
something our own page cannot read. If a script ever got injected into the page,
it could not steal the session.

Chapter 11 covers real authentication, tokens, roles and permissions. Stop here.

---

## 10. ⑭–⑯ Back in the browser: what to do with a response

The client reads the **status first**, body second. The status decides which of
the five paths runs:

```js
if (res.status === 401) { /* drop to signed-out, offer a way back in */ }
if (err.status === 429) { /* "you've sent a lot just now" */ }
if (err.status === 400) { /* show the specific problem, keep their text */ }
if (err.status >= 500)  { /* "nothing was lost", keep their text */ }
```

All 401 handling lives in one place — the single function every request goes
through. If each button did its own `fetch`, session expiry would be handled well
in three places and forgotten in six. **Consistent failure behaviour is an
architectural property, not a diligence property.**

---

## 11. ⑰ Logs, and a privacy decision hiding inside a technical one

A log line is how anyone finds out what the server did after it finished doing
it. The user sees a screen; you see this:

```json
{"event":"request","method":"GET","route":"/","status":200,"ms":32,"user":null}
{"event":"request","method":"POST","route":"/api/session","status":201,"ms":14,"user":null}
{"event":"request","method":"GET","route":"/api/questions","status":200,"ms":621,"user":"ana"}
{"event":"request","method":"POST","route":"/api/questions","status":201,"ms":640,"user":"ana"}
{"event":"request","method":"POST","route":"/api/questions","status":400,"ms":5,"user":"ana"}
```

Two things to notice.

**The `ms` values make latency data.** `640` and `621` are the injected 600ms
delay, visible as a number rather than as a feeling. "It feels slow" becomes "the
95th percentile is 640ms", which is a claim you can act on.

**The question text is not there.** That is deliberate:

```js
const NEVER_LOG = new Set(['text', 'password', 'cookie', 'authorization', 'token']);
```

`[Design interpretation]` The reasoning is not technical. Once user content is in
a log file it has been copied into a system with different retention, different
access control and different backups from the database it was supposed to live
in. Logs get shipped to third-party tools, kept for years, and read by people who
were never granted access to the data itself.

**Somebody decided what a log line is for.** The default — log the whole request
— is a privacy decision made by not making one. This is a place where a designer
has a legitimate and rarely-exercised opinion.

And logs were not theoretical here: three test failures were diagnosed from a
single log line showing `"status":429` where `400` was expected. Without it, the
hunt would have started in the validation code, which was fine.

---

## 12. Break it on purpose

Failures were not waited for. They were caused, and each one was traced through
three layers: what actually happened in the system, what signal it produced, and
what the user should see.

| System reality | Technical signal | What the user sees |
|---|---|---|
| Question too short, typed in the form | *no request at all* | Inline error under the field, instantly, nothing lost |
| Same input sent past the browser | `400 TEXT_TOO_SHORT` | Message under the button, **typed text preserved** |
| A number sent where text was expected | `400 TEXT_NOT_STRING` | Same path — the UI cannot produce this, the server still handles it |
| No session / expired session | `401 NOT_SIGNED_IN` | Dropped to signed-out: "Your session ended. Please sign in again." |
| Someone else's question requested | `403 FORBIDDEN` | "That question belongs to someone else." **No sign-in prompt** |
| Question id does not exist | `404 NOT_FOUND` | "No question with that id." |
| Route does not exist | `404 NO_ROUTE` | A not-found page, not a blank screen |
| Sixth question in a minute | `429 RATE_LIMITED` | "You have sent a lot just now. Try again in a minute." |
| A bug in our code | `500 SERVER_ERROR` | "We could not save it. Nothing was lost — please try again." |
| The database is gone | `500 SERVER_ERROR` | Identical message — the user cannot act on the difference |
| The server is just slow | `201`, eventually | Loading state. **The failure with no error.** |

Three of these deserve a closer look.

### The 500, and what it must not say

With a fault injected, this is the entire response body:

```json
{"error":"SERVER_ERROR","message":"Something went wrong on our end. Your question was not saved."}
```

Asserted in the test suite: **no stack frames, no file paths, no internal error
text.** Meanwhile the full stack goes to the log, where we can read it and a
stranger cannot.

> **Tell yourself everything. Tell the caller nothing.**

And the message does two things at once. *"Something went wrong on our end"* is
honest about whose fault it is — no "please check your input" for a 5xx. *"Your
question was not saved"* answers the question the user actually has, which is not
"what broke" but "did I lose my work?"

Here is that state, measured:

| What was checked | Result |
|---|---|
| Message shown | "We could not save your question. Nothing was lost — please try again." |
| Status region | cleared — no stale "Sending…" |
| Button usable again | `true` |
| **The text the user typed** | **still in the box** |
| Question added to the list | **no** |

`[Design interpretation]` The bolded row is the one that matters. **Preserving
what the user typed is the difference between an error and a disaster**, and it
comes from a code-level decision: the textarea is cleared only on the success
path. One line, and it decides whether a failed request costs someone five
seconds or their whole paragraph.

### The data store dies, and the server does not

The database was deliberately made unavailable mid-run. Writes returned `500` —
and an unrelated endpoint still returned `200`.

`[Design interpretation]` **A dependency failing must not take the whole product
down.** In product terms: when one feature's backing service is out, the rest of
the product should stay usable and say clearly which part is unavailable. The
alternative — an app that shows nothing because one thing is broken — is a design
failure long before it is an infrastructure one.

### The failure with no error

600ms of latency produced no error at all. Every test still passed. Nothing was
lost. It was just *worse*.

`[Design interpretation]` This is the failure a test suite is worst at catching
and a user is best at noticing. It is entirely a design problem, and the design
tools for it are real: loading states, skeletons, optimistic updates, streaming,
doing work in the background. **Latency is not an engineering detail that
occasionally leaks into UX. It is a UX property that happens to be produced by
engineering** — and it becomes much more prominent in Chapter 04, where responses
are generated token by token and can take many seconds.

---

## 13. Testing, and what a passing suite is worth

Chapter 03 owns evaluation. Chapter 01 needs only the deterministic kind: a case
either passes or it does not, with no judgement involved.

**A test case** is three things written down:

```
GIVEN     a signed-in user
WHEN      they POST { text: "hi" }
THEN      the response is 400 with error code TEXT_TOO_SHORT
```

The **expected result is written before the run**. That ordering is the whole
discipline — a test written after the code tends to describe what the code does
rather than what the product needs, and it will happily certify a bug.

Deskline's 25 cases were written into `eval/test-set.md` before a line of the
implementation existed. Groups: happy path · validation with the browser bypassed
· identity and permission · missing things · failure behaviour · state and
persistence · what a response must not contain.

**Happy path** — everything goes right. **Negative cases** — the input or the
state is wrong on purpose. There are five negative cases here for every happy one,
which is roughly the ratio real products deserve and rarely get.

**Regression**, in preview: a failure found once, captured as a permanent test so
it cannot come back unnoticed. F-05 in `failures.md` is written down as exactly
this, waiting for the chapter that fixes it.

The final run:

```
ℹ tests 24
ℹ pass 24
ℹ fail 0
```

### And now the part that matters more

Four earlier runs did not look like that. In **every one**, the first explanation
was wrong:

| | Looked like | Actually was |
|---|---|---|
| **F-01** | The rate limiter fires too early | Tests sharing a user's budget. The limiter was correct |
| **F-02** | The authorization code is broken | An unasserted setup step had been rate-limited. Authorization was never reached |
| **F-03** | The failure handling is broken | The failure handling was fine. The **cleanup** path threw and hung the whole run |
| **F-04** | Sessions are being persisted | Nothing was being persisted. The test was not restarting anything |

F-02 is the one to remember. The suite pointed at the authorization code — the
one component that was provably correct — because a setup step had failed
silently three lines earlier. **A test that does not assert its own preconditions
does not report where the failure is. It reports where the failure became
visible.**

### The five claims, in this chapter's own terms

| Claim | Evidence here |
|---|---|
| 1. **The command ran** | Exit code 0. This means a process ended. Nothing more |
| 2. **The implementation works** | Yes — *for the cases specified*. Untested behaviour is unknown, not correct |
| 3. **The tests pass** | Yes. And four runs did not, and one passed while measuring nothing |
| 4. **The output/experience is good** | **No evidence.** Nobody has used Deskline. Its states are *present and correct*, which is not *good* |
| 5. **The product creates value** | **No evidence.** Nobody has this problem. Deskline solves nothing |

Claims 4 and 5 are not weakly supported. They are **unsupported**, and no number
of additional tests would change that.

`[Design interpretation]` Sit with the gap between 3 and 4. Everything is green.
Nobody knows whether it is any good. That gap does not close with more
engineering — it closes with users, or with evaluation, and Chapter 03 is about
building the second when you cannot get enough of the first. In an AI product the
gap gets much wider, because the output itself becomes a variable.

---

## 14. Security and privacy, at Chapter 01 depth

Not a security chapter. But the questions can be asked now, and the answers are
short.

**What leaves the browser?** The question text and the session cookie. Nothing
else — no analytics, no third parties. Chapter 04 changes that the moment a model
API appears, and that change deserves to be *noticed* rather than absorbed.

**What is stored?** Four columns. No email, no IP, no device data. Nothing kept
"in case it's useful", which is the usual route to holding data nobody can
justify.

**What must not be logged?** User content. See §11.

**What must the server distrust?** Everything in the right-hand column:

```
   WE CONTROL                    WE DO NOT CONTROL
   server code                   the request body
   the database                  the cookie value
   our validation                the URL and its parameters
                                 the client's validation
                                 anything the browser tells us
```

**Where do secrets live?** In the environment — the settings surrounding a
running copy of the program — never in the source.

**Why not in frontend code?** Because everything in `app.js` is downloaded by
every visitor. Minified is not hidden; View Source and the network tab both show
it. An API key in client code is an API key you have published.

`[Design interpretation]` That last one has a consequence Chapter 04 cannot avoid:
**a browser cannot safely hold a key, so it cannot safely call a paid model API
directly.** The request has to go through a server you control. That is why every
AI product has a backend even when the feature looks like it lives entirely in
the page — and it is a security fact before it is an architectural one.

Nine checks derived from that boundary passed. **A passing checklist is not
security** — they were derived from one network hop, one data store and no
external services, and they say nothing about a system with any of those things.
Chapter 12.

---

## 15. Deployment, in one paragraph

Everything above ran on one machine. **Deployment** is putting a copy somewhere
the public can reach, which introduces a real domain, HTTPS, a machine that stays
up, an environment holding the real configuration, and logs going somewhere you
can actually read.

The single idea worth carrying now: **the same code behaves differently in
different environments**, which is why "works on my machine" is a real category of
problem rather than a joke. Deskline demonstrates it in miniature — the same
build becomes slow, or broken, or strict, depending only on `SLOW_MS`,
`FAIL_WRITES` and `RATE_LIMIT`. Chapter 15.

---

## 16. What I can now do

**Explain** — client vs server as *locations* · frontend vs backend · the browser
as a runtime · request and response · HTTP's shape and statelessness · API,
endpoint, contract · JSON · headers · GET/POST/PUT/PATCH/DELETE, safe and
idempotent · 2xx/4xx/5xx and eight specific codes · **401 vs 403** · application
logic · database, record, ID, query · persistent vs temporary state · client
state vs server state · session · authentication vs authorization · environment ·
external APIs · latency · timeout (as a gap, F-05) · error handling · logs ·
deployment in preview.

**Ask, of any feature** — What happens in the browser? What happens on the
server? Where does the data live? What crosses the network? What state exists and
what kills it? What requires authentication, and what requires authorization?
What can fail? What should the user see for each failure? What can be tested
automatically? And what evidence would prove this actually works?

**Build** — a client that validates for kindness, a server that validates for
correctness, an endpoint with a contract, a database write, five distinct error
paths, a loading state, and a log line that omits what it should omit.

**Test** — a case written before the code, a happy path, a negative case, a
permission boundary, an assertion about what a response must *not* contain, and a
setup step that checks itself.

**And distinguish** — the command ran · the implementation works · the tests pass
· the experience is good · the product is valuable. Chapter 01 has real evidence
for the first three and none at all for the last two.

---

## 17. Sources

**Read**
1. MDN, *HTTP request methods* (S-022) — retrieved 31 Aug 2026
2. MDN, *HTTP response status codes* (S-023) — retrieved 31 Aug 2026
3. MDN, *401 Unauthorized* (S-024) — retrieved 31 Aug 2026
4. MDN, *Client-side form validation* (S-025) — retrieved 31 Aug 2026
5. MDN, *Using HTTP cookies* (S-026) — retrieved 31 Aug 2026
6. Node.js, *SQLite* (S-027) — retrieved 31 Aug 2026

**Watched**
- **V-005** — *What Is an API? Types, Uses, & AI Integration*, IBM Technology,
  2 Jul 2026, 8m17s. Current, and it makes the bridge to Chapter 04 explicitly.
- **V-006** — *What is a REST API?*, IBM Technology, 23 Oct 2020, 9m12s. Six
  years old; the concepts it covers have not moved, but check any specific claim
  against MDN.

`[Our observation]` **No video was found covering the end-to-end request
lifecycle** at a standard worth including. Searched; nothing current and
authoritative surfaced, and inserting a weak one to fill the row would break the
handbook's own rule. The request trace in §4 and the diagram in
`architecture.md` do that job instead. Recorded rather than papered over.

## 18. Experiment

`experiments/01-request-response-app` — README, annotated architecture, 25
written-first test cases, results including the four failing runs, eight recorded
failures, and the security notes.

---

## 19. Learning Checkpoint

*Added 31 August 2026, when the checkpoint became a standing requirement for
every chapter. Nothing above this line was changed.*

Attempt these before reading §20. Each requires transferring the chapter's
reasoning to a situation the chapter did not describe.

**Q1 — Saved, and then not saved.**
A user edits their profile, sees "Saved", refreshes the page, and the old data
returns. Which system boundaries would you investigate, and in what order? What
is the single most likely explanation?

**Q2 — The hidden button.**
A viewer-role user does not see the Delete button, because the UI hides it for
that role. Does that establish that viewers cannot delete? Explain what would,
and what test would prove it.

**Q3 — 200 and wrong.**
An endpoint returns `200 OK` with a body containing the wrong business data.
Which of the five evidence claims have actually been demonstrated, and which have
not?

**Q4 — Which code, and what does the screen say?**
For each, name the status code you would expect and describe the screen the user
should see: (a) a signed-in user opens a link to a document belonging to another
team; (b) a user's session expired twenty minutes ago; (c) a bookmarked link
points to a document that was deleted last week. Why must (a) and (b) not share a
screen?

**Q5 — The feature that "should be easy".**
A product manager asks: "can managers see their team's questions?" Using
Deskline's schema, explain what has to change and why this is not a UI-only
request.

**Q6 — Nine seconds.**
An AI feature takes nine seconds to respond. Nothing errors, no data is lost,
every test passes. Is anything wrong? What would you change, and what would you
measure to know whether it helped?

**Q7 — The key in the page.**
An engineer proposes calling a paid model API directly from the browser to
"avoid the extra hop", putting the key in a minified bundle. Give the security
objection and the architectural consequence.

**Q8 — What survived?**
A server is restarted. Afterwards, users are signed out but all their data is
intact. Explain precisely why those two outcomes differ, and name one design
change that would alter the first without touching the second.

---

## 20. Checkpoint Discussion / Reasoning

*Read after attempting §19.*

**Q1.** Investigate in this order, cheapest first: (1) **did the write actually
happen** — check the response status; a `2xx` is a claim by the server, so also
check the database. (2) **Did the client show "Saved" on the right signal** — an
optimistic UI that renders success on click rather than on confirmation will say
"Saved" for a request that failed. (3) **Does the read path return what the write
path stored** — caching, a stale replica, or a query filtering on something
different.

**Most likely: (2).** The refresh is the tell. Refreshing discards client state
and forces a real read, so the disagreement is between what the *interface
believed* and what the *system stored* — which is §8's distinction exactly. The
screen showing something is not the system holding it.

**Q2.** No. Hiding a control is a rendering decision made on the user's own
machine, and everything there is under their control (§5). The button's absence
prevents a click; it does not prevent a request. Authorization is established by
**the server refusing the action**, checked per record, on every request.

What would establish it: a server-side check like Deskline's `403` on
`q.user_id !== session.userId`. The test that proves it is `T-14`'s shape —
authenticate as the viewer, send the delete request **without going through the
UI at all**, and assert `403`. If that returns `200`, the product has been
relying on a hidden button as a permission.

**Q3.** Demonstrated: **claim 1** (a request completed) and, weakly, that the
transport works. **Not demonstrated: claim 2** — the implementation does *not* do
what it was meant to do, which is the definition of this bug. Claims **3, 4 and
5** are untouched: if a test asserted this response it was asserting the wrong
thing, and nothing here speaks to experience or value.

The sharp version: **`200` is a statement about the request, not about the
answer.** A system can be perfectly healthy at the HTTP layer and completely
wrong at the business layer, and status codes cannot tell you the difference.
This is exactly why Chapter 03 exists — and it gets harder with a model, whose
output is *plausible* by construction.

**Q4.** (a) **403** — identity is fine, permission is not. Explain, and offer
somewhere useful to go; requesting access is a reasonable affordance.
(b) **401** — offer a sign-in path, and preserve what they were doing so they
return to it.
(c) **404** — say the document no longer exists; a link to a list is kind.

**Why (a) and (b) must not share a screen:** a 401 screen invites the user to
sign in, and that works. Offering the same to someone already signed in sends
them around a loop that cannot succeed — they sign in, they still cannot see it,
and nothing tells them why. It is the most demoralising failure state in
software, and it is produced entirely by collapsing two status codes into one
template.

**Q5.** Today ownership is one column, `user_id`, and every read filters on it:
`WHERE user_id = ?`. "Managers see their team's" requires:

1. **A concept of a team** the data does not currently have — a `team_id`, or a
   manager/report relationship. New column or new table.
2. **A concept of a role.** `manager` is not a thing the system knows.
3. **A changed query** on every screen that lists questions.
4. **A changed authorization check** on the single-question route — currently a
   simple equality, now "mine, or my report's".
5. **New tests**, including negative ones: a manager must *not* see another
   team's questions. That test does not exist because that situation could not
   previously occur.

**Why it is not UI-only:** the visibility rule lives in the data model and the
query, not in the interface. The interface can only show what the query returns.
This is §7's point — *ownership is not a UI feature, it is a column* — and it is
why "just show more" is never just showing more.

**Q6.** Yes, something is wrong, and it is invisible to every mechanism in
Chapter 01. It is the failure with no error (§12): nothing to catch, nothing to
log, no status code, and a green test suite.

**What to change** — design tools, not engineering ones: a loading state that
sets an expectation, streaming so the first useful token arrives early, doing the
work in the background so the user is not blocked, or reducing what is requested.
**What to measure**: latency distribution rather than an average (the average
hides the tail, and the tail is what people remember), abandonment during the
wait, and task completion. Note that a faster response nobody completes is not an
improvement — which is a claim-4 question, and needs users, not tests.

**Q7.** **Security objection:** everything the browser downloads is readable by
whoever downloaded it. Minification is not encryption — View Source and the
network tab both show it. An API key shipped to a browser is a published API key,
and the only remedy is rotating it (§14).

**Architectural consequence:** since the browser cannot hold the key, it cannot
call the paid API directly. The request must go through a server you control,
which holds the key in its environment. **That is why every AI product has a
backend, even when the feature appears to live entirely in the page** — and it is
a security fact that turns into an architecture, not a preference.

Worth noting the secondary benefits that fall out of the same hop: rate limiting
per user, logging, cost control, and the ability to change model or provider
without shipping new client code.

**Q8.** The two outcomes differ because of **where each thing was stored**, and
nothing else. Sessions were held in a `Map` in the server process's memory, which
ceased to exist when the process did. Questions were written to a file on disk,
which the new process opened and read. The user's cookie is still perfectly
valid-looking; there is simply nothing alive that knows what it means (§8).

**A design change that alters the first without touching the second:** store
sessions in the database instead of memory. Sessions then survive a restart, and
the user stays signed in. The cost is a lookup on every request, plus expiry and
cleanup to manage.

The point worth carrying: **"users get signed out when we deploy" is not a policy
and not a bug. It is a storage decision** — one somebody made, possibly without
noticing, and one a designer can legitimately ask to have revisited.
