import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the respondent-experience case study.
 *
 * One section per visible section, in the same order — the page maps narration
 * index to section id, so the two files have to be edited together.
 *
 * This is a spoken transposition of the approved page copy, not a second
 * version of the story. It narrates the insight behind each visual rather than
 * the labels inside it; reading a diagram aloud node by node produces a
 * transcript nobody can follow. The one place it deliberately reads verbatim is
 * the respondent's own six lines, because those are the evidence.
 *
 * Public-safe: the employer and product environment are named because they are
 * approved public context. No participant, client or tenant name appears, the
 * recurring cycle's internal label is never spoken, and no pilot figures —
 * invitation counts, response counts or participation rates — are spoken. Those
 * are internal analytics. The public statement is qualitative: the response base
 * was too small for confident interpretation.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'What happened',
        body:
            'A recurring feedback cycle was feeding a dashboard, and the dashboard had limited value. The response base was too small to interpret anything with confidence. The obvious explanation was that the survey asked too much. It did not. Three questions, about two minutes — and participation was still falling with each round. So I stopped looking at the survey and started looking at everything around it.',
    },
    {
        title: 'What I went looking for',
        body:
            'Five questions, none of them about the form. How were people introduced to the cycle? Did they understand why they were being asked? Did they trust that answers were anonymous? Did they know what would happen with what they said? And had answering last time visibly changed anything?',
    },
    {
        title: 'What I found',
        body:
            'The welcome communication was often missed. The reminder was becoming the entry point — people were arriving at the survey without having read the thing that explained it. In the respondent\'s own words: another workplace email. What is this about again? Is my answer really anonymous? Who will see this? Did anything happen? Why should I answer again? The experience broke in two places: between the invitation and the reminder, and between submitting and seeing any consequence. Anonymity was stated as a word rather than explained as a practice. In small teams people were not sure they could not be identified, and open text felt personally traceable. After submitting, nothing visible happened.',
    },
    {
        title: 'What that changed in my understanding',
        body:
            'Participation was not one problem. It was five conditions the experience had to answer for the person being asked, and the cycle was weak on most of them. Relevance: why does this matter, and why am I being asked again? Effort: what does responding require beyond the time in the form? Safety: can I answer honestly without being personally exposed? Impact: what happens after I submit? And ownership: who is responsible for acting? I did not bring these with me. They are the questions the experience kept failing to answer, written down. A recurring survey has to earn the next response.',
    },
    {
        title: 'What I recommended, and why',
        body:
            'Four decisions, each traced to its evidence. The reminder had become the real entry point, which meant the experience could not depend on the welcome being remembered — so every reminder had to be independently understandable. Anonymous was stated but not explained, and an abstract privacy claim does not create felt safety — so grouped reporting, open-text handling and minimum-response protection had to be explained. Respondents saw no impact after submitting, which meant a recurring request had not earned the next response — so the loop needed a visible close. And governance and manager ownership were blurred, with no role clearly owning what happens next — so governance and action ownership had to be separated. Alongside these: a clearer explanation of cadence, a neutral no-blocker-this-week path, and a review of repeatedly negative question framing.',
    },
    {
        title: 'What was tested',
        body:
            'Nothing. Every item is a recommendation. None shipped, none has post-change measurement, none is validated. What they rest on: a respondent interview, an HR and governance interview, management feedback, reviews of the welcome and reminder communications, a walk-through of the respondent journey, and a review of how roles moved through the dashboards.',
    },
    {
        title: 'What remains unknown',
        body:
            'This case does not claim that communication changes alone increased participation. What it shows is how the investigation reframed the problem, from questionnaire length to respondent context and trust. The study was early and directional, with one respondent interview and no quantitative validation, conducted in one organisation. Management input was stakeholder feedback rather than a formal interview. It does not explain all survey non-response, and it is not presented as if it does. And whether any recommendation would have worked is unknown.',
    },
];
