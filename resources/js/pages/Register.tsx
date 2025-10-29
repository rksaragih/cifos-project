import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { useToast } from "@/Components/hooks/use-toast";
import { Star } from "lucide-react";
import { register as registerApi } from "@/Components/lib/auth";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", agreeToTerms: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast({ title: "Error", description: "Please agree to the Terms and Conditions", variant: "destructive" });
      return;
    }
    if (formData.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(formData.fullName, formData.email, formData.password);
      if (res.success) {
        toast({ title: "Account created!", description: "Welcome to CIFOS!" });
        // register already stores a basic user & token; redirect to home or profile
        navigate('/');
      } else {
        toast({ title: "Error", description: res.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-primary/10 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200')`,
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
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Must be 8 characters at least</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                By creating an account means you agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link>
                {', and our '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6" disabled={loading}>
              Sign Up
            </Button>

            <div className="text-center text-sm text-muted-foreground">or do it via other accounts</div>

            <div className="flex justify-center gap-6">
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">G</Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12"></Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">f</Button>
            </div>

            <div className="text-center text-sm">
              Aldready have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
