"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      <main className="flex-grow min-h-screen flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-900 text-white">
        <section className="text-center mb-10 md:mb-14 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Track your share ledger with ease
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300">
            Softwarence LTD TradeLedger keeps your share information updated and
            organized.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
          <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
            <CarouselContent>
              {["a", "b"].map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start gap-4">
                      <Mail className="h-6 w-6 text-blue-500" />
                      <div>
                        <p>{message}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-950 text-white">
        © 2026 Softwarence LTD TradeLedger. All rights reserved.
      </footer>
    </>
  );
}
