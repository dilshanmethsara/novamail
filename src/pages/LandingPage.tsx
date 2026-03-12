import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Shield, Zap, Clock, Eye, RefreshCw,
  Copy, ArrowRight, ChevronDown, Lock, Trash2
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  }),
};

const features = [
  { icon: Zap, title: "Instant Generation", desc: "Get a disposable email address in one click. No signup, no waiting." },
  { icon: Shield, title: "Complete Privacy", desc: "Your identity stays anonymous. No personal data required, ever." },
  { icon: Clock, title: "Auto Expiry", desc: "Addresses self-destruct after your session ends. Zero trace left behind." },
  { icon: Eye, title: "Live Inbox", desc: "Watch emails arrive in real-time with auto-refresh and instant notifications." },
  { icon: Lock, title: "Spam Protection", desc: "Keep your real inbox clean. Use temp addresses for signups and trials." },
  { icon: Trash2, title: "One-Click Delete", desc: "Destroy your session and all associated data with a single click." },
];

const steps = [
  { num: "01", title: "Generate", desc: "Click the button to create a random temporary email address instantly." },
  { num: "02", title: "Use It", desc: "Copy the address and use it to sign up for any service or website." },
  { num: "03", title: "Receive", desc: "Emails arrive in your temporary inbox in real-time. Read and manage them." },
];

const faqs = [
  { q: "How long does a temporary email last?", a: "Each session lasts 60 minutes by default. You can extend or regenerate a new address at any time." },
  { q: "Is my data stored anywhere?", a: "No. All emails and session data are automatically purged after expiry. We store nothing permanently." },
  { q: "Can I send emails from a temp address?", a: "Currently, temp addresses are receive-only. This ensures maximum privacy and prevents misuse." },
  { q: "Is this service free?", a: "Yes, completely free with no ads, no tracking, and no hidden costs." },
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <div className="ambient-bg" />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8 text-xs text-muted-foreground glass-card">
                <Shield size={12} className="text-primary" />
                Private & Secure — No signup required
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Disposable Inbox.{" "}
              <span className="gradient-text">Permanent Privacy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
            >
              Generate a secure, anonymous email address in one click. Read emails instantly with no signup. Free and instant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/inbox" className="btn-glow text-sm py-3 px-8">
                <Mail size={16} />
                Generate My Inbox
                <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn-glass text-sm">
                Learn More
                <ChevronDown size={14} />
              </a>
            </motion.div>
          </div>

          {/* Inbox Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="glass-card p-1 rounded-3xl">
              <div className="rounded-[1.25rem] overflow-hidden" style={{ background: "hsl(220 30% 7%)" }}>
                {/* Mockup toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 70% 50%)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(40 70% 50%)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(120 50% 45%)" }} />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="glass-card rounded-lg px-3 py-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Lock size={10} />
                      nova-mail.io/inbox
                    </div>
                  </div>
                </div>
                {/* Mockup content */}
                <div className="p-4 sm:p-6">
                  <div className="glass-card rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail size={16} className="text-primary shrink-0" />
                      <span className="font-mono text-sm text-foreground truncate">example@nova-mail.io</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="btn-glass py-1.5 px-3 text-xs cursor-default"><Copy size={12} /> Copy</div>
                      <div className="btn-glass py-1.5 px-3 text-xs cursor-default"><RefreshCw size={12} /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { sender: "GitHub", subject: "Verify your email address", time: "2m", unread: true },
                      { sender: "Spotify", subject: "Confirm your account", time: "5m", unread: true },
                      { sender: "Amazon", subject: "Your order has shipped", time: "18m", unread: false },
                    ].map((item, i) => (
                      <div key={i} className={`glass-card rounded-xl p-3 flex items-center gap-3 ${item.unread ? 'border-primary/20' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${item.unread ? 'btn-glow p-0' : ''}`}
                          style={!item.unread ? { background: "hsl(var(--secondary))" } : {}}>
                          {item.sender[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${item.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{item.sender}</span>
                            {item.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Built for <span className="gradient-text">Privacy & Speed</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to protect your real inbox, with zero compromises.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 2} className="glass-card-hover p-6 rounded-2xl group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-border group-hover:border-primary/30 transition-colors"
                  style={{ background: "hsl(var(--card) / 0.8)" }}>
                  <f.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Three Steps. <span className="gradient-text">That's It.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1} className="glass-card p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold gradient-text mb-3">{s.num}</div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full glass-card rounded-xl p-4 text-left flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 pt-2"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Ready to Protect Your <span className="gradient-text">Privacy?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-8">
              Generate your disposable inbox now. Free, instant, anonymous.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/inbox" className="btn-glow text-sm py-3 px-8 inline-flex">
                <Mail size={16} />
                Generate My Inbox
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Nova Mail</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Nova Mail. Privacy-first disposable email.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
