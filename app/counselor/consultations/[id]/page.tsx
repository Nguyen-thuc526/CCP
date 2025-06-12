'use client';

import React from 'react';
import ReportSection from '@/components/counselor/report-section';

const reportData: Record<string, any> = {
    1: {
        couple: ['Nguyễn Văn A', 'Nguyễn Thị B'],
        date: '01/06/2025',
        expert: 'Trần Thị B',
        issue: 'Kỹ năng giao tiếp',
        progress: 'Đang cải thiện',
        users: [
            {
                name: 'Nguyễn Văn A',
                mbti: 'INFP',
                loveLang: 'Words of Affirmation',
                big5: {
                    Openness: 80,
                    Conscientiousness: 65,
                    Extraversion: 30,
                    Agreeableness: 85,
                    Neuroticism: 60,
                },
                disc: 'SC',
                notes: {
                    mbti: 'Bạn có xu hướng sống nội tâm...',
                    loveLang: 'Bạn nhạy cảm với lời nói...',
                    disc: 'Bạn là người kiên định...',
                    conclusion: 'Bạn phù hợp với người có xu hướng ổn định và thấu cảm...',
                },
            },
            {
                name: 'Nguyễn Thị B',
                mbti: 'ISFJ',
                loveLang: 'Quality Time',
                big5: {
                    Openness: 70,
                    Conscientiousness: 75,
                    Extraversion: 35,
                    Agreeableness: 90,
                    Neuroticism: 50,
                },
                disc: 'CS',
                notes: {
                    mbti: 'Bạn sống hướng nội, giàu cảm xúc...',
                    loveLang: 'Bạn thích được quan tâm, dành thời gian cùng nhau...',
                    disc: 'Bạn kiên trì và nhẹ nhàng...',
                    conclusion: 'Bạn phù hợp với người biết quan tâm, lắng nghe...',
                },
            },
        ],
    },
};

interface CoupleReportPageProps {
    params: { id: string };
}

export default function CoupleReportPage({ params }: CoupleReportPageProps) {
    const id = params.id;

    const report = reportData[id];
    if (!report) {
        return <div className="p-6">Không tìm thấy báo cáo cho cặp đôi này.</div>;
    }

    const { couple, date, expert, issue, progress, users } = report;

    // Hàm nhỏ để hiển thị Big5 dưới dạng danh sách
    const renderBig5 = (big5: Record<string, number>) => (
        <ul className="list-disc list-inside">
            {Object.entries(big5).map(([trait, value]) => (
                <li key={trait}>
                    <strong>{trait}:</strong> {value}%
                </li>
            ))}
        </ul>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-primary">Báo cáo tư vấn cặp đôi</h1>
            <div className="mb-6 text-center">
                <p className="text-lg">
                    <span className="font-semibold text-primary">Vấn đề tư vấn:</span> {issue}
                </p>
                <p className="text-lg">
                    <span className="font-semibold text-primary">Tiến triển:</span>{" "}
                    <span
                        className={`inline-block rounded px-2 py-0.5 text-white text-sm ${
                            progress === 'Đang cải thiện'
                                ? 'bg-yellow-500'
                                : progress === 'Ổn định'
                                ? 'bg-green-600'
                                : 'bg-red-500'
                        }`}
                    >
                        {progress}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-pink-50 p-6 rounded-lg mb-8 text-gray-800 border border-primary/20">
                {users.map((user, i) => (
                    <div key={i}>
                        <h2 className="text-xl font-bold mb-2 text-primary">{user.name}</h2>
                        <p><span className="font-semibold">Ngày tư vấn:</span> {date}</p>
                        <p><span className="font-semibold">Chuyên viên:</span> {expert}</p>
                        <p><span className="font-semibold">MBTI:</span> {user.mbti}</p>
                        <p><span className="font-semibold">Love Language:</span> {user.loveLang}</p>
                        <p><span className="font-semibold">DISC:</span> {user.disc}</p>
                    </div>
                ))}
            </div>

            {/* MBTI */}
            <ReportSection title="MBTI – Phân tích tính cách" summary="So sánh MBTI của hai người">
                <div className="grid grid-cols-2 gap-6">
                    {users.map((user, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-lg mb-2">{user.name} – {user.mbti}</h3>
                            <p>{user.notes.mbti}</p>
                        </div>
                    ))}
                </div>
            </ReportSection>

            {/* Love Language */}
            <ReportSection title="Love Language – Ngôn ngữ tình yêu" summary="So sánh ngôn ngữ tình yêu của hai người">
                <div className="grid grid-cols-2 gap-6">
                    {users.map((user, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-lg mb-2">{user.name} – {user.loveLang}</h3>
                            <p>{user.notes.loveLang}</p>
                        </div>
                    ))}
                </div>
            </ReportSection>

            {/* Big5 */}
            <ReportSection title="Big5 – Phân tích tính cách chi tiết" summary="So sánh các đặc điểm tính cách theo mô hình Big5">
                <div className="grid grid-cols-2 gap-6">
                    {users.map((user, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                            {renderBig5(user.big5)}
                        </div>
                    ))}
                </div>
            </ReportSection>

            {/* DISC */}
            <ReportSection title="DISC – Phân tích hành vi" summary="So sánh phong cách hành vi DISC của hai người">
                <div className="grid grid-cols-2 gap-6">
                    {users.map((user, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-lg mb-2">{user.name} – {user.disc}</h3>
                            <p>{user.notes.disc}</p>
                        </div>
                    ))}
                </div>
            </ReportSection>

            <div className="mt-10 bg-primary/10 border border-primary rounded-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Kết luận & Định hướng cho cặp đôi</h2>
                {users.map((user, i) => (
                    <p className="mb-3 text-gray-800" key={i}>
                        <strong>{user.name}:</strong> {user.notes.conclusion}
                    </p>
                ))}
            </div>
        </div>
    );
}
