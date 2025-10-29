import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { useToast } from "@/Components/hooks/use-toast";
import { Star } from "lucide-react";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms and Conditions",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome to CIFOS!"
    });
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:flex items-center justify-center bg-primary/10 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative z-10 text-center text-white space-y-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold">LOGO</span>
          </div>
          <h1 className="text-5xl font-bold">Selamat Datang di CIFOS!</h1>
          <p className="text-xl">Hadirkan Kelezatan, Ciptakan Kebersamaan.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold">LOGO</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground">It's free and easy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">Full name</Label>
              <Input 
                id="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">E-mail or phone number</Label>
              <Input 
                id="email"
                type="text"
                placeholder="Type your e-mail or phone number"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Type your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Must be 8 characters at least</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox 
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                By creating an account means you agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link>
                {', and our '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6">
              Sign Up
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              or do it via other accounts
            </div>

            <div className="flex justify-center gap-6">
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
            </div>

            <div className="text-center text-sm">
              Aldready have an account?{' '}
              <Link to="/admin/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
