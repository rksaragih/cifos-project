import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MapPin as MapIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: "",
    name: "",
    email: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic || !formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "We'll get back to you soon."
    });
    
    setFormData({ topic: "", name: "", email: "", description: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3">Contact us</h1>
                <p className="text-secondary text-lg">We'd love to hear from you — questions, feedback or booking requests, send us a message and we'll get back as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="topic" className="text-sm font-medium mb-2 block">Topic</Label>
                  <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="reservation">Reservation</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">Your name</Label>
                    <Input 
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium mb-2 block">Description (optional)</Label>
                  <Textarea 
                    id="description"
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full min-h-[100px] resize-none"
                  />
                </div>

                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white px-8">
                  SEND REQUEST
                </Button>
              </form>
            </div>

            {/* Contact details & location (moved from About) */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Kontak Kami</CardTitle>
                  <CardDescription>Hubungi kami untuk informasi lebih lanjut</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Telepon</h3>
                      <a 
                        href="https://wa.me/6281234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +62 812-3456-7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a 
                        href="mailto:info@restoranelegan.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@restoranelegan.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Jam Operasional</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Senin - Jumat: 10:00 - 22:00</p>
                        <p>Sabtu - Minggu: 09:00 - 23:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Lokasi Kami</CardTitle>
                  <CardDescription>Kunjungi restoran kami</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Alamat</h3>
                      <p className="text-muted-foreground">
                      Puncak Rd No.24, Kp. Parung Jambu, Bendungan, Ciawi,<br />
                      Bogor Regency, West Java 16720
                      </p>
                    </div>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <a
                      href="https://maps.app.goo.gl/ibcmU7HJBxSaA1gu5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      Lihat di Google Maps
                    </a>
                  </Button>

                  <div className="mt-6">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.892261514713!2d106.85205909999999!3d-6.6602727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c975081859e1%3A0x82c4bfbc21776031!2sCifos%20ciawi!5e0!3m2!1sen!2sid!4v1760724292116!5m2!1sen!2sid"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Ikuti Kami</CardTitle>
                  <CardDescription>Tetap terhubung dengan kami melalui media sosial</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <a
                        href="https://facebook.com/restoranelegan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Facebook className="w-5 h-5" />
                        Facebook
                      </a>
                    </Button>

                    <Button asChild variant="outline" size="lg">
                      <a
                        href="https://www.instagram.com/cifos_ciawi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Instagram className="w-5 h-5" />
                        Instagram
                      </a>
                    </Button>

                    <Button asChild variant="outline" size="lg">
                      <a
                        href="https://twitter.com/restoranelegan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Twitter className="w-5 h-5" />
                        Twitter
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
