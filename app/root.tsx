import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { HttpErrorPage } from "~/components/public/http-error-page";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let title = "Terjadi Kendala pada Sistem";
  let message = "Maaf, halaman tidak dapat dimuat saat ini.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title =
      error.status === 404
        ? "Halaman Tidak Ditemukan"
        : `Kesalahan ${error.status}`;
    message =
      error.status === 404
        ? "Halaman yang Anda cari mungkin telah dipindahkan, tautannya kedaluwarsa, atau alamat URL yang dimasukkan salah."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
  }

  return <HttpErrorPage status={status} title={title} message={message} />;
}

