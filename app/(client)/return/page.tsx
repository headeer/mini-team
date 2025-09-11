import Container from "@/components/Container";

export default function ReturnPage({ searchParams }: { searchParams?: { session_id?: string } }) {
  const sessionId = searchParams?.session_id;
  return (
    <div className="bg-white">
      <Container className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Dziękujemy za zamówienie!</h1>
          {sessionId ? (
            <p className="text-gray-600">Numer sesji: {sessionId}</p>
          ) : (
            <p className="text-gray-600">Powrót z płatności.</p>
          )}
        </div>
      </Container>
    </div>
  );
}


