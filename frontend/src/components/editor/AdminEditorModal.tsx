import styles from './AdminEditorModal.module.css'

export default function AdminEditorModal({ onClose }) {
    return (
        <div className={styles.editorModal}>
            <div className={styles.input_info}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        에디터 추가
                    </h2>
                    <form className="space-y-4">
                        {/* 프로필 이미지 URL */}
                        <div>
                            <label className="block text-sm font-medium mb-1">이미지 URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* 이름 */}
                        <div>
                            <label className="block text-sm font-medium mb-1">이름</label>
                            <input
                                type="text"
                                required
                            />
                        </div>

                        {/* 한줄 설명 */}
                        <div>
                            <label className="block text-sm font-medium mb-1">한줄 설명</label>
                            <input
                                type="text"
                            />
                        </div>

                        {/* 긴 설명 */}
                        <div>
                            <label className="block text-sm font-medium mb-1">긴 설명</label>
                            <textarea
                                rows={4}
                            />
                        </div>

                        {/* SNS 주소 리스트 */}
                        <div>
                            <label className="block text-sm font-medium mb-1">SNS 주소</label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="https://facebook.com/..."
                                />
                                <button
                                    type="button"
                                >
                                    삭제
                                </button>
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm"
                                >
                                    + SNS 주소 추가
                                </button>
                            </div>
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={() => onClose()}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                            >
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}