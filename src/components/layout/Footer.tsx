export function Footer() {
    return (
        <footer className="container mx-auto px-6 py-12 text-center text-sm text-muted-foreground border-t max-w-[1440px] flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CraftLayers by Hariteja Nandipati</p>
            <div className="flex gap-6">
                <a href="/about" className="hover:text-primary transition-colors">About</a>
                <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
        </footer>
    );
}
