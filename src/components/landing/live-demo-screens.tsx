"use client";

import { motion } from "framer-motion";
import SmsInboxAnimation from "./sms-inbox-animation";
import PhoneCallAnimation from "./phone-call-animation";

const LiveDemoScreens = () => {
    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        See It <span className="text-primary">In Action</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Watch real-time SMS delivery and crystal-clear global calls — all from your virtual numbers.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto items-start">
                    {/* SMS Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <SmsInboxAnimation />
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-foreground mb-2">
                                Global SMS Inbox
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Receive messages from 150+ countries in one unified inbox. OTP codes, notifications, and conversations — all in real-time.
                            </p>
                        </div>
                    </motion.div>

                    {/* Call Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <PhoneCallAnimation />
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-foreground mb-2">
                                Crystal-Clear Calls
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Accept and manage incoming calls from anywhere in the world. HD voice quality with real-time audio visualization.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LiveDemoScreens;
