
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (!oauthError) return;

    sessionStorage.removeItem("impacthub_oauth_pending");

    const friendlyMessages = {
      account_not_linked:
        "An unverified email/password account already exists for this email. Please sign in with your email and password.",
      state_mismatch:
        "Google sign-in session expired or was interrupted. Please try again.",
      state_security_mismatch:
        "Google sign-in state mismatch. Please click Login with Google once and try again.",
      please_restart_the_process:
        "Google sign-in session expired. Please try again.",
    };

    toast.error(
      friendlyMessages[oauthError] ||
        `Google login failed (${oauthError.replace(/_/g, " ")}).`
    );
    router.replace("/login");
  }, [router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      if (data) {
        toast.success("Login successful!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("impacthub_oauth_pending", "1");
      }

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login",
      });

      if (error) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("impacthub_oauth_pending");
        }
        toast.error(error.message || "Google login failed");
        setIsLoading(false);
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("impacthub_oauth_pending");
      }
      toast.error("Unable to login with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-10 flex w-full max-w-md flex-col gap-6 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Login to continue your ImpactHub journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                >
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator>
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
