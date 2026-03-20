"use server";
import LoginForm from "@/components/auth/login-form";

async function LoginPage() {
  return (
    <div className="hero">
      <div className="hero-content justify-center min-h-screen">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
