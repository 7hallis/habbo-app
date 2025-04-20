"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleBuscar = () => {
    if (username.trim()) {
      router.push(`/usuario/${username}`);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1 className="mb-2">Buscar perfil Habbo</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Digite o nome do usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <Button variant="secondary" onClick={handleBuscar}>
          Buscar
        </Button>
      </div>
    </main>
  );
}
