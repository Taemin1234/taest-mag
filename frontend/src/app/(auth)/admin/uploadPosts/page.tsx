"use client"

import React, { useState, useRef } from "react";
// import axios from "axios";
import Link from "next/link";
import QuillEditor from '@/components/ui/QuillEditor';

interface FormData {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    editor: string;
}

export default function uploadPosts () {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        subtitle: '',
        content: '',
        category: '',
        editor: '',
    });

    return (
        <div>
            <h1>새 글 작성</h1>
            <form>
                <div>
                    <label htmlFor="title">
                        제목
                    </label>
                    <input type="text" id="title" required />
                </div>
                <div>
                    <label htmlFor="subtitle">
                        부제목
                    </label>
                    <input type="text" id="subtitle" required />
                </div>
                <div>
                    <label htmlFor="content">
                        내용
                    </label>
                    <QuillEditor/>
                </div>
                <div>
                    <button>저장</button>
                    <button>취소</button>
                </div>
            </form>
        </div>
    )
}