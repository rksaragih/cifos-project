import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/Components/hooks/use-toast";
import { Star } from "lucide-react";
import { login as loginApi, getUser, findUserByIdentifier } from "@/Components/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = formData.email.trim();
      const password = formData.password;
      const res = await loginApi(email, password);
      if (res.success) {
        toast({ title: "Login successful!", description: "Welcome back!" });
        // ensure user object exists locally
        const user = getUser();
        if (!user) {
          // getUser() will be set by auth.login in most cases, but fallback:
          localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
        }
        navigate('/');
      } else {
        // if user exists, it's likely a wrong password; otherwise suggest registration
  const existing = findUserByIdentifier(email);
  const message = existing ? 'Wrong password — please try again' : 'No account found with this email/phone. Please register.';
        toast({ title: "Error", description: res.message ?? message, variant: "destructive" });
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
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6" disabled={loading}>
              Sign In
            </Button>

            <div className="text-center text-sm text-muted-foreground">or do it via other accounts</div>

            <div className="flex justify-center gap-6">
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">G</Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12"></Button>
              <Button type="button" variant="outline" size="icon" className="rounded-full w-12 h-12">f</Button>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
