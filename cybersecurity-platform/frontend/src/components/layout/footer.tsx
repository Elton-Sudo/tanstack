export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:space-x-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F5C242' }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#E86A33' }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#3B8EDE' }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#8CB841' }} />
              </div>
              <span className="font-medium">SWIIFF Security</span>
            </div>
            <span className="hidden md:inline">|</span>
            <span>© {currentYear} CyberSecurity Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
            <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
