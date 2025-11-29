'use client';

import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamGridProps {
    config: {
        heading?: string;
        subheading?: string;
        members?: Array<{
            name: string;
            role: string;
            bio?: string;
            image?: string;
            linkedin?: string;
            twitter?: string;
            email?: string;
        }>;
    };
}

export const TeamGrid: React.FC<TeamGridProps> = ({ config }) => {
    const { heading, subheading, members = [] } = config;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(heading || subheading) && (
                    <div className="text-center mb-16">
                        {subheading && (
                            <p className="text-primary font-semibold mb-2">{subheading}</p>
                        )}
                        {heading && (
                            <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {members.map((member, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative mb-6 overflow-hidden rounded-2xl">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                                        <span className="text-4xl text-gray-400 font-bold">
                                            {member.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {member.name}
                            </h3>
                            <p className="text-primary font-medium mb-3">{member.role}</p>
                            {member.bio && (
                                <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                            )}
                            <div className="flex justify-center gap-3">
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                                {member.twitter && (
                                    <a
                                        href={member.twitter}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {member.email && (
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Mail className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
