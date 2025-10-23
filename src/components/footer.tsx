import {
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/">
              <h1 className="mb-3 text-2xl">Parallel</h1>
            </Link>
            <p className="text-sm text-gray-300">
              Transform the way you look with science-backed facial analysis and
              personalized transformation protocols.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/parallelalexander/">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600">
                  <SiInstagram className="h-4 w-4" />
                </div>
              </Link>
              <Link href="https://www.tiktok.com/@parallelalexander">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600">
                  <SiTiktok className="h-4 w-4" />
                </div>
              </Link>
              <Link href="https://www.youtube.com/@parallelalexander">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600">
                  <SiYoutube className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* <div className="space-y-4">
          <h3 className="font-semibold text-white">Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Facial Analysis
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Glow Up Stack
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Progress Tracking
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Expert Consultation
              </a>
            </li>
          </ul>
        </div> */}

          {/* <div className="space-y-4">
          <h3 className="font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Success Stories
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div> */}

          {/* <div className="space-y-4">
          <h3 className="font-semibold text-white">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div> */}
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Parallel Laboratories LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              {/* <a href="#" className="transition-colors hover:text-white">
              Cookies
            </a> */}
            </div>
          </div>
          {/* <div className="mt-4 text-xs text-gray-500">
          <p className="mb-2">
            Disclaimer: This service is for educational and entertainment
            purposes only. Results may vary and are not guaranteed. Consult
            with qualified professionals before making any medical or
            cosmetic decisions.
          </p>
          <p>
            This platform does not provide medical advice and should not be
            used as a substitute for professional medical consultation.
          </p>
        </div> */}
        </div>
      </div>
    </footer>
  );
}
