"use client"

import React, { useRef, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FilePlus, Loader2 } from "lucide-react";
import { useUploadImage } from "@/hooks/upload-image";

export default function SubmitCertificate() {
    const { uploadImage, imageUrl, loading } = useUploadImage();
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: "",
        imageUrl: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage({
                file,
                onSuccess: (url) => {
                    setFormData((prev) => ({ ...prev, imageUrl: url }));
                },
                onError: (err) => {
                    alert("Upload ảnh thất bại: " + err);
                },
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const now = new Date().toLocaleString(); // hoặc .toLocaleString() nếu bạn muốn định dạng dễ đọc hơn

        const submittedData = {
            ...formData,
            date: now,
        };

        console.log("Dữ liệu nộp:", submittedData);

        // Gửi dữ liệu đi tại đây (ví dụ: POST tới API)
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FilePlus className="w-5 h-5" />
                        Nộp chứng chỉ
                    </CardTitle>
                    <CardDescription>
                        Nhập thông tin chứng chỉ để lưu vào hồ sơ chuyên môn của bạn.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Tên chứng chỉ</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="date">Thời gian nộp</Label>
                        <Input disabled id="date" type="date" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cert-image">Tải ảnh chứng chỉ</Label>
                        <Input
                            style={{ color: 'red' }}
                            ref={fileInputRef}
                            id="cert-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="imageUrl">Link ảnh chứng chỉ</Label>
                        <Input id="imageUrl" value={formData.imageUrl} readOnly />

                        {loading && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải ảnh lên...
                            </div>
                        )}

                        {formData.imageUrl && (
                            <div className="mt-2">
                                <Label className="text-sm text-muted-foreground mb-1 block">Ảnh đã tải lên:</Label>
                                <img
                                    src={formData.imageUrl}
                                    alt="Certificate Preview"
                                    className="w-full max-w-xs rounded-md border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả chi tiết về chứng chỉ, cơ quan cấp, nội dung học tập..."
                            rows={4}
                        />
                    </div>
                </CardContent>

                <CardFooter className="justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setFormData({ name: "", date: "", description: "", imageUrl: "" })}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Đang tải..." : "Nộp chứng chỉ"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
