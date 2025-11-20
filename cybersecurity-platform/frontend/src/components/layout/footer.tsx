export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-brand-blue" />
              <div className="h-3 w-3 rounded-full bg-brand-green" />
              <div className="h-3 w-3 rounded-full bg-brand-orange" />
              <div className="h-3 w-3 rounded-full bg-brand-red" />
            </div>
            <span>© {currentYear} CyberSec Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="/support" className="text-muted-foreground hover:text-foreground">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
