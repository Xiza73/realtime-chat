import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorParams {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: ErrorParams) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen-with-header w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Lo sentimos, algo salió mal.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Código de error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ocurrió un error inesperado. Por favor, inténtelo de nuevo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
