import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock } from "lucide-react";
import Image from "next/image";

// Esse componente roda no server por padrão no Next.js App Router

async function getHabboData(username: string) {
  const base = "https://www.habbo.com.br/api/public";

  const resUser = await fetch(`${base}/users?name=${username}`);
  if (!resUser.ok) throw new Error("Usuário não encontrado");
  const userData = await resUser.json();

  function formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  userData.memberSince = formatarData(userData.memberSince);
  function formatarUltimoAcesso(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  userData.lastAccessTime = formatarUltimoAcesso(userData.lastAccessTime);
  const habboId = userData.uniqueId;

  const [roomsRes, groupsRes, badgesRes, friendsRes] = await Promise.all([
    fetch(`${base}/users/${habboId}/rooms`),
    fetch(`${base}/users/${habboId}/groups`),
    fetch(`${base}/users/${habboId}/badges`),
    fetch(`${base}/users/${habboId}/friends`), // Nova chamada para buscar amigos
  ]);

  const [rooms, groups, badges, rawFriends]: [
    { id: string; name: string; usersCount: number }[],
    {
      badgeCode: string;
      id: string;
      badge: string;
      name: string;
      online: boolean;
      primaryColour?: string;
      description?: string;
      isAdmin?: boolean;
      roomId?: string;
    }[],
    { code: string; name: string }[],
    {
      id: string;
      name: string;
      motto: string;
      figureString: string;
      addedDate?: string;
    }[]
  ] = await Promise.all([
    roomsRes.json(),
    groupsRes.json(),
    badgesRes.json(),
    friendsRes.json(),
  ]);

  // Separar friends em um let
  const friends = Array.isArray(rawFriends) ? rawFriends : []; // Garante que friends seja um array
  friends.forEach((friend) => {
    friend.addedDate = friend.addedDate || "2023-01-01T00:00:00Z"; // Data fixa para teste
  });

  console.log("Dados dos amigos:", friends);

  return { userData, rooms, groups, badges, friends };
}

export interface PageProps {
  params: Promise<{ username: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | undefined; // Alinhado com o Next.js
}

// Removed unused searchParams declaration

export default async function PerfilPage({ params }: PageProps) {
  const resolvedParams = await params; // Aguarde a resolução do Promise
  const { username } = resolvedParams;
  const decodedUsername = decodeURIComponent(username);

  let userData, rooms, groups, badges, friends;

  try {
    ({ userData, rooms, groups, badges, friends } = await getHabboData(
      decodedUsername
    ));
    friends = Array.isArray(friends) ? friends : []; // Garante que friends seja um array
    friends.forEach((friend) => {
      friend.addedDate = friend.addedDate || "2023-01-01T00:00:00Z"; // Data fixa para teste
    });
    console.log("Dados dos amigos:", friends);
    console.log("Emblema Favorito (selectedBadges):", userData.selectedBadges);
    console.log("Resposta da API (userData):", userData);

    // Adiciona a propriedade profileVisible (exemplo: baseado em uma lógica)
    userData.profileVisible = userData.profileVisible ?? true; // Define como true por padrão, se não existir

    // Adiciona o nível atual (exemplo: baseado em uma lógica ou valor retornado pela API)
    userData.currentLevel = userData.currentLevel ?? "Nível 1"; // Exemplo de valor padrão
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    return (
      <main style={{ padding: 20 }}>
        <h1>Perfil de {decodedUsername}</h1>
        <p style={{ color: "red" }}>
          Erro ao carregar os dados:{" "}
          {err instanceof Error ? err.message : "Erro desconhecido"}
        </p>
      </main>
    );
  }

  // Verifica se o perfil está visível
  if (!userData.profileVisible) {
    return (
      <main style={{ padding: 20 }}>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Perfil de {decodedUsername}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-4 mb-4">
            <div>
              <Image
                src={`https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${userData.figureString}&size=l`}
                alt="Avatar"
                width={150} // Defina a largura
                height={150} // Defina a altura
                priority // Carrega a imagem com prioridade
              />
            </div>
            <div>
              <p className="flex gap-2 font-bold text-lg text-gray-800 dark:text-gray-100">
                Este perfil é privado.
                <Lock className="text-red-600" />
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Missão:
                <span className="font-bold m-2 text-gray-900">
                  {userData.motto}
                </span>
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Status:
                {userData.online ? (
                  <span className="font-bold m-2 text-green-900">Online</span>
                ) : (
                  <span className="font-bold m-2 text-red-900">Offline</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Perfil de {decodedUsername}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-4 mb-4">
            <div>
              <Image
                src={`https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${userData.figureString}&size=l`}
                alt="Avatar"
                width={150} // Defina a largura
                height={150} // Defina a altura
                priority // Carrega a imagem com prioridade
              />
            </div>
            <div>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Último acesso:
                <span className="font-bold m-2 text-gray-900">
                  {userData.lastAccessTime}
                </span>
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Membro desde:
                <span className="font-bold m-2 text-gray-900">
                  {userData.memberSince}
                </span>
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Missão:
                <span className="font-bold m-2 text-gray-900">
                  {userData.motto}
                </span>
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Status:
                {userData.online ? (
                  <span className="font-bold m-2 text-green-900">Online</span>
                ) : (
                  <span className="font-bold m-2 text-red-900">Offline</span>
                )}
              </p>
              <p className="font-medium text-lg text-gray-500 dark:text-gray-100">
                Nível atual:
                <span className="font-bold m-2 text-gray-900">
                  {userData.currentLevel}
                </span>
              </p>
              <Card>
                <CardContent>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-100">
                    Emblema Favorito
                  </h3>
                  {userData.selectedBadges &&
                  userData.selectedBadges.length > 0 ? (
                    <Image
                      src={`https://images.habbo.com/c_images/album1584/${userData.selectedBadges[0].code}.gif`}
                      alt={
                        userData.selectedBadges[0].name || "Emblema Favorito"
                      }
                      title={
                        userData.selectedBadges[0].name || "Emblema Favorito"
                      }
                      width={40}
                      height={40}
                    />
                  ) : (
                    <p className="font-medium text-lg text-gray-800 dark:text-gray-100">
                      Nenhum emblema favorito selecionado.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 border rounded-md mb-4 mt-4">
        <div className="p-2">
          <h3 className="font-semibold text-lg">Quartos</h3>
        </div>
        <ScrollArea className="h-72 w-full">
          <ul
            style={{ listStyle: "none", padding: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" // Responsivo: 1 coluna em telas muito pequenas, 2 em pequenas, 4 em grandes
          >
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <li
                  key={room.id}
                  className="border p-4 rounded-md flex flex-col items-center justify-center"
                  style={{ minHeight: "120px" }} // Define uma altura mínima para os itens
                >
                  <Badge>
                    🏠 {room.name} ({room.usersCount} online)
                  </Badge>
                </li>
              ))
            ) : (
              <li className="font-bold text-center col-span-1 sm:col-span-2">
                Nenhum quarto encontrado.
              </li>
            )}
          </ul>
        </ScrollArea>
      </div>
      <div className="p-4 border rounded-md mb-4 mt-4">
        <div className="p-2">
          <h3 className="font-semibold text-lg">Grupos</h3>
        </div>
        <ScrollArea className="h-72 w-full">
          <ul
            style={{ listStyle: "none", padding: 0 }}
            className="grid grid-cols-2 gap-4" // Define duas colunas
          >
            {groups.length > 0 ? (
              groups.map((group) => (
                <li
                  key={group.id}
                  className="border p-4 rounded-md flex flex-col items-center justify-center"
                  style={{ minHeight: "120px" }} // Define uma altura mínima para os itens
                >
                  <Image
                    src={`https://www.habbo.com.br/habbo-imaging/badge/${group.badgeCode}.gif`}
                    alt={`Emblema do grupo ${group.name}`}
                    width={40}
                    height={40}
                  />
                  <div className="text-center mt-2">
                    <strong className="text-sm">{group.name}</strong>
                    <p className="text-xs text-gray-500 mt-1">
                      {group.description || "Sem descrição"}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="font-bold text-center col-span-2">
                Sem grupos encontrados.
              </li>
            )}
          </ul>
        </ScrollArea>
      </div>
      <div className="p-4 border rounded-md mb-4 mt-4 h-full">
        <div className="grid grid-cols-2 gap-4">
          {/* Título */}
          <div className="p-2 col-span-2">
            <h3 className="font-semibold text-lg">Amigos e Emblemas</h3>
          </div>

          {/* Amigos */}
          <ScrollArea className="h-72 w-full">
            {userData.profileVisible ? (
              <ul
                style={{ listStyle: "none", padding: 0 }}
                className="flex flex-col items-center justify-start gap-4"
              >
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <li
                      key={friend.id}
                      className="flex items-center justify-start gap-4 w-full p-2"
                      style={{ minHeight: "80px" }} // Define uma altura mínima para os itens
                    >
                      <Image
                        src={`https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${friend.figureString}&size=s`}
                        alt={`Avatar de ${friend.name}`}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div className="flex flex-col justify-center">
                        <strong className="text-sm">{friend.name}</strong>
                        <p className="text-xs text-gray-500">{friend.motto}</p>
                        {friend.addedDate ? (
                          <p className="text-xs text-gray-400">
                            Adicionado em:{" "}
                            {new Date(friend.addedDate).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">
                            Data de adição não disponível
                          </p>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    Nenhum amigo encontrado.
                  </li>
                )}
              </ul>
            ) : (
              <p className="font-bold text-gray-500">
                Este perfil é privado. Amigos não podem ser exibidos.
              </p>
            )}
          </ScrollArea>

          {/* Emblemas */}
          <ScrollArea className="h-72 w-full">
            <div>
              <div className="flex flex-wrap gap-4">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <Image
                      key={badge.code}
                      src={`https://images.habbo.com/c_images/album1584/${badge.code}.gif`}
                      alt={badge.name}
                      title={badge.name}
                      width={40}
                      height={40}
                    />
                  ))
                ) : (
                  <p className="font-bold">Nenhum emblema encontrado.</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
