import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Email harus diisi");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful password reset request
      console.log("Password reset requested for:", email);
      setSuccess(true);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Email Terkirim!</CardTitle>
                <CardDescription>
                  Kami telah mengirimkan link reset password ke email Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Silakan periksa inbox email Anda dan ikuti instruksi untuk mereset password.
                    Jika tidak menemukan email, periksa folder spam.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Tidak menerima email?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        setSuccess(false);
                        setEmail("");
                      }}
                      className="p-0 h-auto text-primary hover:underline"
                    >
                      Kirim ulang
                    </Button>
                  </p>
                  
                  <div className="flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <Link
                      to="/login"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Kembali ke halaman login
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
              <CardDescription>
                Masukkan email Anda dan kami akan mengirimkan link untuk mereset password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Kembali ke halaman login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;


