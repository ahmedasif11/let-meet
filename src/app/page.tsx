import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const carouselItems = ['Book A Call', 'Join A Call'];

export default function Home() {
  return (
    <main className="bg-background">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome To The Video Calling App</h1>
        <p className="text-lg text-center mt-4">
          This is a video calling app for you to connect with your friends and
          family.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </div>

      {/* <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-4xl font-bold">Start a new call</h1>
        <div className="flex flex-col items-center justify-center mt-4">
          <Button className="mt-4" asChild>
            <Link href="/login">Book a call</Link>
          </Button>
          <Button className="mt-4" asChild>
            <Link href="/login">Join a call</Link>
          </Button>
        </div>
      </div> */}

      <div className="mb-96 flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-10 text-center font-semibold">
          Go Ahead And meet your friends and family
        </h1>
        <Carousel
          className="w-full max-w-xs"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{item}</span>
                      <Button className="mt-4">
                        <Link href="/login">{item}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
  );
}
