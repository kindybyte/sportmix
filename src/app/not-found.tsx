import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-7xl font-bold text-signal">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Страница не найдена</h1>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Возможно, товар скрыт или ссылка устарела. Вернитесь в каталог — там вся актуальная продукция.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-outline btn-lg">На главную</Link>
          <Link href="/catalog" className="btn btn-primary btn-lg">В каталог</Link>
        </div>
      </div>
    </div>
  );
}
