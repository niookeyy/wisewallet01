import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const AppLayout = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Wise Wallet</p>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            {email ? <p className="text-sm text-muted-foreground truncate max-w-[220px]">{email}</p> : null}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={signingOut}>
            {signingOut ? "Keluar..." : "Logout"}
          </Button>
        </div>
      </header>
      <main className="pb-28">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
