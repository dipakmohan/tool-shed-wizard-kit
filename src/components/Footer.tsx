
const Footer = () => {
  return (
    <footer className="py-4 px-4 sm:px-6 lg:px-8 bg-card border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Toolkit. All rights reserved. Made with ♡ by Lovable.</p>
      </div>
    </footer>
  );
};

export default Footer;
