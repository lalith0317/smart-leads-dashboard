import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

export const RegisterPage = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your workspace" subtitle="Register as an admin or sales user and start tracking qualified leads.">
      <form className="grid gap-4" onSubmit={submit}>
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
        <Select label="Role" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="sales">Sales User</option>
          <option value="admin">Admin</option>
        </Select>
        {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-200">{error}</div> : null}
        <Button type="submit" disabled={loading}>
          <UserPlus size={18} />
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
        Already registered?{" "}
        <Link className="font-semibold text-pine dark:text-emerald-300" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
