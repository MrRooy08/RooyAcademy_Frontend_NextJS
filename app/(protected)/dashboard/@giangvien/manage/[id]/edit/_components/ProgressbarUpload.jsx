"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { X, Minimize2, Maximize2, Upload, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUploadChunkFileMutation } from "@/app/features/courses/courseApi"
import { uploadChunksParallel } from "@/lib/media"

export function ProgressbarUpload({ files, onFinish, onClose }) {
    console.log("files", files);
    const [uploadChunk] = useUploadChunkFileMutation();
    const [isMinimized, setIsMinimized] = useState(false)
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({
        totalFiles: 0,
        completedFiles: 0,
        failedFiles: 0,
        totalSize: 0,
        uploadedSize: 0,
        uploadSpeed: 0,
        timeRemaining: 0,
    })


    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.round(seconds)}s`
        if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`
        return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`
    }

    const overallProgress = async (files) => {
        const fileId = `${Date.now()}-${files.name}`;
        let uploaded = 0;
        const chunkSize = 5 * 1024 * 1024;
        const totalChunks = Math.ceil(files.size / chunkSize);
        // await uploadChunksParallel(files, (chunk, index) => {
        //     uploadChunk({ chunk, index, fileId }).unwrap().then(() => {
        //         uploaded++;
        //         setProgress(Math.round((uploaded / totalChunks) * 100))
        //     })
        // })
        await uploadChunksParallel(files, (chunkSize, index) => {
            // Giả lập upload mỗi chunk mất 500ms
            return new Promise((resolve) => {
              setTimeout(() => {
                uploaded++;
                setProgress(Math.round((uploaded / totalChunks) * 100));
                resolve({ success: true, chunkIndex: index });
              }, 500); 
            });
        })
        alert("Upload hoàn tất!");
    }

    useEffect(() => {
        if(!files) return

        if (files instanceof File) {
            overallProgress(files)
        }
    }, [files])

    return (
        <div
            className={cn("fixed bottom-4 right-4 w-80 z-50 transition-all duration-300", isMinimized ? "h-16" : "h-auto")}
        >
            <Card className="shadow-lg border-2">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Trạng thái Upload
                        </CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 p-0">
                                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="space-y-4">
                        {/* Overall Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Tổng tiến trình</span>
                                <span >%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span>Hoàn thành</span>
                                </div>
                                <p className="font-medium">
                                    {stats.completedFiles}/{stats.totalFiles} file
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                    <Upload className="h-3 w-3 text-blue-500" />
                                    <span>Tốc độ</span>
                                </div>
                                <p className="font-medium">{formatBytes(stats.uploadSpeed)}/s</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-orange-500" />
                                    <span>Còn lại</span>
                                </div>
                                <p className="font-medium">{formatTime(stats.timeRemaining)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                    <Upload className="h-3 w-3 text-purple-500" />
                                    <span>Dung lượng</span>
                                </div>
                                <p className="font-medium">
                                    {formatBytes(stats.uploadedSize)}/{formatBytes(stats.totalSize)}
                                </p>
                            </div>
                        </div>

                        {/* File List */}
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            <h4 className="text-xs font-medium text-muted-foreground">Chi tiết file:</h4>
                            {/* {files.slice(0, 3).map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {formatBytes(file.size)}
                                    </Badge>
                                </div>
                            ))}
                            {files.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center">+{files.length - 3} file khác</p>
                            )} */}
                        </div>
                    </CardContent>
                )}

                {isMinimized && (
                    <CardContent className="py-2">
                        <div className="flex items-center justify-between text-xs">
                            <span>
                                {stats.completedFiles}/{stats.totalFiles} file
                            </span>
                            <span>{Math.round(overallProgress)}%</span>
                        </div>
                        <Progress value={overallProgress} className="h-1 mt-1" />
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
