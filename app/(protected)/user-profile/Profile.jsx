"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  User,
  Shield, Globe,
  Github, Instagram, Twitter, Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Senior Product Designer at Acme Inc. with over 8 years of experience in UX/UI design, product strategy, and team leadership.",
    position: "Senior Product Designer",
    company: "Acme Inc.",
    joined: "March 2020",
  });

  const handleEditToggle = () => {
    if (isEditing) {
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <Button
            onClick={handleEditToggle}
            variant={isEditing ? "default" : "outline"}
            className="animate-fadeIn"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="animate-fadeIn hover-lift">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4"></div>
                  {isEditing && (
                    <button className="absolute bottom-4 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-center">
                  {profile.name}
                </h2>
                <p className="text-gray-500 text-center">{profile.position}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-8 w-7 text-gray-400 mr-3" />
                    <span className="text-lg">{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-8 w-7 text-gray-400 mr-3" />
                    <span className="text-lg">{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-8 w-7 text-gray-400 mr-3" />
                    <span className="text-lg">{profile.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-7 text-gray-400 mr-3" />
                    <span className="text-lg">{profile.company}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-8 w-7 text-gray-400 mr-3" />
                    <span className="text-lg">Joined {profile.joined}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <User className="h-7 w-4" />
                  <span className="text-xl">About</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-7 w-4" />
                  <span className="text-xl">Security</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="animate-fadeIn ">
                <Card className="md:mt-6 px-2 py-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={profile.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profile.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              name="location"
                              value={profile.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                              id="position"
                              name="position"
                              value={profile.position}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              name="company"
                              value={profile.company}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-700 text-lg">{profile.bio}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">
                              First Name
                            </h4>
                            <p className="font-sans font-medium">
                              {profile.name}
                            </p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">
                              Last Name
                            </h4>
                            <p className="font-sans font-medium">
                              {profile.name}
                            </p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">
                              Position
                            </h4>
                            <p className="font-sans font-medium">Viet Nam </p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">
                              Company
                            </h4>
                            <p className="font-medium font-sans">Google </p>
                          </div>
                          <div className="flex gap-10 px-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 border-blue-500 text-blue-500 transition-all duration-300 ease-in-out 
                              hover:animate-bounce-once hover:scale-105 hover:rotate-3 origin-bottom-right 
                              hover:border-blue-600 hover:text-blue-600 "
                            >
                              <Mail
                                size={16}
                                className="transition-transform duration-300 hover:scale-110 origin-bottom-right"
                              />
                              <span className="hidden sm:inline">Email</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 
                            border-green-500 text-green-500 transition-all duration-300 ease-in-out 
                            hover:scale-105 hover:rotate-3 origin-bottom-right 
                            hover:border-green-600 hover:text-green-600 hover:animate-bounce-once">
                              <Globe size={16} />
                              <span className="hidden sm:inline">Website</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 
                            border-gray-500 text-gray-500 transition-all duration-300 ease-in-out 
                              hover:animate-bounce-once  hover:rotate-3 hover:scale-105 origin-bottom-right
                            
                            ">
                              <Github size={16} />
                              <span className="hidden sm:inline">GitHub</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 
                            border-pink-500 text-pink-500 transition-all duration-300 ease-in-out hover:border-pink-600 
                            hover:text-pink-600 hover:animate-bounce-once hover:scale-105 hover:rotate-3 origin-bottom-right 
                            ">
                              <Instagram size={16} />
                              <span className="hidden sm:inline">Instagram</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 border-blue-400 text-blue-400 hover:border-blue-500 hover:text-blue-500
                            transition-all duration-300 ease-in-out
                            hover:animate-bounce-once hover:scale-105 hover:rotate-3 origin-bottom-right
                            ">
                              <Twitter size={16} />
                              <span className="hidden sm:inline">Twitter</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 border-blue-800 text-blue-800 hover:border-blue-900 hover:text-blue-900
                            transition-all duration-300 ease-in-out
                            hover:animate-bounce-once hover:scale-105 hover:rotate-3 origin-bottom-right
                            ">
                              <Linkedin size={16} />
                              <span className="hidden sm:inline">LinkedIn</span>
                            </Button>
                          </div>

                          {/* <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">Facebook</h4>
                            <p className="font-sans font-medium">{profile.company}</p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">Instagram</h4>
                            <p className="font-sans font-medium">{profile.company}</p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">Youtube</h4>
                            <p className="font-sans font-medium">{profile.company}</p>
                          </div>
                          <div className="rounded-md border bg-[#F9FAFB] px-4 py-2">
                            <h4 className="text-base font-normal text-gray-500">LinkedIn</h4>
                            <p className="font-sans font-medium">{profile.company}</p>
                          </div> */}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="animate-fadeIn">
                <Card className="md:mt-6">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Password updated",
                          description:
                            "Your password has been changed successfully.",
                        });
                      }}
                    >
                      Update Password
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
