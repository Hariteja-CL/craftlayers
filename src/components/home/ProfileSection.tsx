import { motion } from "framer-motion";

import { homeContent } from "@/data/home-content";

export function ProfileSection() {
    const { profile } = homeContent;

    return (
        <section className="container mx-auto px-6 pb-24 max-w-[1440px]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/50 p-8 md:p-10"
            >
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                    {/* Avatar Area */}
                    <div className="flex-shrink-0 flex flex-col items-start gap-[2px] w-[188px]">
                        <div className="flex justify-center items-center p-2 pt-[10px] w-[188px] h-[188px]">
                            <div className="relative h-[172px] w-[172px] flex-none rounded-lg overflow-hidden bg-gray-200">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <a
                            href={profile.social.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row justify-between items-center p-2 w-[188px] h-[32px] bg-info-100 transition-colors hover:bg-info-100/80"
                        >
                            <svg width="16" height="16" viewBox="8 8 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none w-4 h-4">
                                <path d="M22.5 8.37506H9.5C9.20504 8.37206 8.92093 8.48619 8.71002 8.69241C8.49911 8.89863 8.37863 9.1801 8.375 9.47506V22.5276C8.37928 22.8221 8.50006 23.1029 8.7109 23.3086C8.92173 23.5143 9.20547 23.6281 9.5 23.6251H22.5C22.795 23.6274 23.0789 23.5129 23.2897 23.3065C23.5005 23.1002 23.621 22.8188 23.625 22.5238V9.47131C23.6197 9.17722 23.4986 8.89709 23.288 8.69181C23.0773 8.48654 22.7941 8.37271 22.5 8.37506Z" fill="#0076B2" />
                                <path d="M10.6326 14.0908H12.8964V21.3746H10.6326V14.0908ZM11.7651 10.4658C12.0248 10.4658 12.2786 10.5428 12.4945 10.6871C12.7103 10.8314 12.8785 11.0364 12.9778 11.2763C13.0772 11.5162 13.1031 11.7802 13.0523 12.0348C13.0016 12.2895 12.8765 12.5233 12.6928 12.7068C12.5091 12.8903 12.2751 13.0153 12.0204 13.0658C11.7657 13.1163 11.5018 13.0901 11.262 12.9906C11.0222 12.891 10.8173 12.7226 10.6732 12.5066C10.5292 12.2906 10.4524 12.0367 10.4526 11.7771C10.453 11.4292 10.5914 11.0957 10.8375 10.8498C11.0836 10.6039 11.4173 10.4658 11.7651 10.4658ZM14.3164 14.0908H16.4864V15.0908H16.5164C16.8189 14.5183 17.5564 13.9146 18.6576 13.9146C20.9501 13.9096 21.3751 15.4183 21.3751 17.3746V21.3746H19.1114V17.8308C19.1114 16.9871 19.0964 15.9008 17.9351 15.9008C16.7739 15.9008 16.5764 16.8208 16.5764 17.7758V21.3746H14.3164V14.0908Z" fill="white" />
                            </svg>
                            <span className="flex-none w-[146px] text-center text-caption font-medium text-gray-600 whitespace-nowrap">
                                {profile.social.linkedin}
                            </span>
                        </a>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 space-y-4 pt-1">
                        <div>
                            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
                                {profile.name}
                            </h2>
                            <p className="font-medium text-gray-600 mt-2 text-lg">
                                {profile.role}
                            </p>
                            <p className="text-base text-gray-500">
                                {profile.location}
                            </p>
                        </div>

                        <div className="h-px w-full max-w-[500px] bg-transparent pb-2" />

                        <p className="max-w-3xl text-lg leading-relaxed text-gray-700">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
