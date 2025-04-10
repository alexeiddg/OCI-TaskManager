"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/theming/modeToggle";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            PMS<span className="text-primary">.</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary"
          >
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Log in
          </Link>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <ModeToggle />
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container mx-auto border-t py-4 px-4 md:px-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 border-t pt-4">
              <Link
                href="/login"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Log in
              </Link>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                All your projects in one place, just like Notion
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Streamline your workflow, collaborate seamlessly, and bring your
                ideas to life with our intuitive project management system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
          </div>
          <Image
            src="https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1200"
            width={550}
            height={550}
            alt="Dashboard Preview"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Customizable Workspaces",
      description:
        "Create personalized workspaces that adapt to your team's unique workflow and project needs.",
      icon: "Layout",
    },
    {
      title: "Seamless Collaboration",
      description:
        "Work together in real-time with your team, share feedback, and track changes effortlessly.",
      icon: "Users",
    },
    {
      title: "Powerful Integrations",
      description:
        "Connect with your favorite tools and services to create a unified workflow experience.",
      icon: "Puzzle",
    },
    {
      title: "Intuitive Interface",
      description:
        "Navigate through projects with ease using our clean, Notion-inspired interface design.",
      icon: "MousePointer",
    },
    {
      title: "Advanced Task Management",
      description:
        "Organize tasks with custom fields, priorities, dependencies, and automated workflows.",
      icon: "CheckSquare",
    },
    {
      title: "Comprehensive Analytics",
      description:
        "Gain insights into your team's productivity with detailed reports and visualizations.",
      icon: "BarChart",
    },
  ];

  return (
    <section
      id="features"
      className="w-full bg-muted/50 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything you need to manage projects
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
              Our platform combines the best of Notion with powerful project
              management capabilities to help your team stay organized and
              productive.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {feature.icon === "Layout" && (
                    <>
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <line x1="3" x2="21" y1="9" y2="9" />
                      <line x1="9" x2="9" y1="21" y2="9" />
                    </>
                  )}
                  {feature.icon === "Users" && (
                    <>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  )}
                  {feature.icon === "Puzzle" && (
                    <>
                      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.235-1.873a.999.999 0 0 0-1.414-1.009l-2.12.919a1 1 0 0 0-.585.585l-.919 2.12a1 1 0 0 0 1.009 1.414l1.873-.235c.47-.059.88.273.95.743a.98.98 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1 1 0 0 0-.878-.29c-.588.088-1.177.088-1.765 0a1 1 0 0 0-.878.29L4.853 19.44c-.47.47-1.087.706-1.704.706s-1.233-.235-1.704-.706l-1.611-1.61a.98.98 0 0 1-.276-.838c.07-.47.48-.802.95-.743l1.873.235A1 1 0 0 0 3.8 15.481l-.919-2.12a1 1 0 0 0-.585-.585l-2.12-.919a1 1 0 0 0-1.414 1.009l.235 1.873c.059.47-.273.88-.743.95a.98.98 0 0 1-.837-.276l-1.61-1.61a2.404 2.404 0 0 1-.706-1.704c0-.617.236-1.234.706-1.704L.99 8.83a1 1 0 0 0 .29-.877c-.088-.589-.088-1.177 0-1.766a1 1 0 0 0-.29-.877l-1.568-1.568A2.402 2.402 0 0 1-.58 3.039C-.58 2.422-.345 1.805.126 1.335l1.61-1.611a.98.98 0 0 1 .838-.276c.47.07.802.48.743.95l-.235 1.873a1 1 0 0 0 1.414 1.009l2.12-.919a1 1 0 0 0 .585-.585l.919-2.12a1 1 0 0 0-1.009-1.414l-1.873.235c-.47.059-.88-.273-.95-.743a.98.98 0 0 1 .276-.837l1.611-1.61A2.404 2.404 0 0 1 6.463.002c.617 0 1.234.236 1.704.706l1.568 1.568a1 1 0 0 0 .877.29c.589-.088 1.177-.088 1.766 0a1 1 0 0 0 .877-.29l1.568-1.568A2.402 2.402 0 0 1 16.557.002c.617 0 1.234.235 1.704.706l1.611 1.61a.98.98 0 0 1 .276.838c-.07.47-.48.802-.95.743l-1.873-.235a1 1 0 0 0-1.009 1.414l.919 2.12a1 1 0 0 0 .585.585l2.12.919a1 1 0 0 0 1.414-1.009l-.235-1.873c-.059-.47.273-.88.743-.95a.98.98 0 0 1 .837.276l1.611 1.611a2.404 2.404 0 0 1 .706 1.704c0 .617-.235 1.234-.706 1.704l-1.568 1.568a1 1 0 0 0-.29.877c.088.589.088 1.177 0 1.766z" />
                    </>
                  )}
                  {feature.icon === "MousePointer" && (
                    <>
                      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                      <path d="m13 13 6 6" />
                    </>
                  )}
                  {feature.icon === "CheckSquare" && (
                    <>
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </>
                  )}
                  {feature.icon === "BarChart" && (
                    <>
                      <line x1="12" x2="12" y1="20" y2="10" />
                      <line x1="18" x2="18" y1="20" y2="4" />
                      <line x1="6" x2="6" y1="20" y2="16" />
                    </>
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "This PMS has completely transformed how our team collaborates. The Notion-like interface makes it intuitive for everyone to use.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      avatar:
        "https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      quote:
        "We've tried countless project management tools, but this one strikes the perfect balance between flexibility and structure.",
      author: "Michael Chen",
      role: "CTO at StartupX",
      avatar:
        "https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      quote:
        "The customizable workspaces have allowed each department to tailor the system to their specific needs while maintaining company-wide visibility.",
      author: "Emily Rodriguez",
      role: "Operations Director at CreativeInc",
      avatar:
        "https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ];

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Loved by teams worldwide
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              customers have to say about our project management system.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm"
            >
              <div className="space-y-4">
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 3 projects",
        "Basic templates",
        "Core collaboration features",
        "5GB storage",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per user/month",
      description: "Ideal for growing teams and organizations",
      features: [
        "Unlimited projects",
        "Advanced templates",
        "All collaboration features",
        "25GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom fields",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific needs",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced security",
        "User provisioning",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full bg-muted/50 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
              Choose the plan that&apos;s right for your team. All plans include
              a 14-day free trial.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border ${
                plan.popular ? "border-primary shadow-lg" : "border-border"
              } bg-background p-6`}
            >
              {plan.popular && (
                <div className="mb-4 w-fit rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Most Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="my-6 flex-1 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? "" : "bg-background text-foreground hover:bg-muted"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      question: "How is this different from Notion?",
      answer:
        "While inspired by Notion's intuitive interface, our PMS is specifically designed for project management with features like task dependencies, Gantt charts, and specialized project templates that Notion doesn't offer natively.",
    },
    {
      question: "Can I import my data from other project management tools?",
      answer:
        "Yes, we offer seamless import from popular tools like Asana, Trello, Jira, and even Notion. Our import wizard will guide you through the process of mapping your existing data to our system.",
    },
    {
      question: "Is there a limit to the number of team members?",
      answer:
        "Our Free plan supports up to 5 team members. The Pro plan allows unlimited team members with per-user pricing, and Enterprise plans offer custom user arrangements for large organizations.",
    },
    {
      question: "Do you offer custom onboarding for teams?",
      answer:
        "Yes, Pro plans include a basic onboarding session, while Enterprise plans come with comprehensive onboarding, training, and dedicated account management to ensure your team's success.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "Free plans include community support and email assistance. Pro plans offer priority email and chat support during business hours. Enterprise plans include 24/7 dedicated support with guaranteed response times.",
    },
    {
      question: "Can I try before I buy?",
      answer:
        "We offer a 14-day free trial on all paid plans with no credit card required. You can experience all features before making a decision.",
    },
  ];

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
              Everything you need to know about our project management system.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-bold">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="w-full border-t py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to transform how your team works?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of teams who have already improved their
              productivity with our Notion-like project management system.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:gap-8 md:px-6">
        <div className="flex flex-col gap-3 md:gap-2">
          <Link href="/" className="font-bold text-xl">
            PMS<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The complete project management solution <br />
            inspired by Notion&apos;s flexibility.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-6 flex flex-col items-center justify-between gap-4 border-t py-6 px-4 md:h-24 md:flex-row md:py-0 md:px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} PMS Inc. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 2H2v10h10V2zM22 2h-10v10h10V2zM12 12H2v10h10V12zM22 12h-10v10h10V12z" />
            </svg>
            <span className="sr-only">Slack</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
