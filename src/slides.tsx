import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type ContentItem = {
  point: string;
  description?: string;
  example?: {
    language?: string;
    content: string;
  };
}

type Slide = {
  title: string;
  content: ContentItem[];
}

type Topic = {
  title: string;
  slides: Slide[];
}

const SlideManager = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [currentTopic, setCurrentTopic] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          setTopics(json)
          setCurrentTopic(0)
          setCurrentSlide(0)
        } catch (error) {
          console.error("Error parsing JSON file:", error)
          alert("Error parsing JSON file. Please make sure it's a valid JSON.")
        }
      }
      reader.readAsText(file)
    }
  }

  const nextSlide = () => {
    if (currentSlide < topics[currentTopic].slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else if (currentTopic < topics.length - 1) {
      setCurrentTopic(currentTopic + 1)
      setCurrentSlide(0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else if (currentTopic > 0) {
      setCurrentTopic(currentTopic - 1)
      setCurrentSlide(topics[currentTopic - 1].slides.length - 1)
    }
  }

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Carica i tuoi topics</CardTitle>
            <CardDescription>Seleziona un file JSON contenente i tuoi topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Carica JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTopicData = topics[currentTopic]
  const currentSlideData = currentTopicData.slides[currentSlide]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{currentTopicData.title}</CardTitle>
          <CardDescription>
            Slide {currentSlide + 1} di {currentTopicData.slides.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">{currentSlideData.title}</h2>
          <ul className="space-y-4">
            {currentSlideData.content.map((item, index) => (
              <li key={index} className="list-none">
                <p className="font-semibold">{item.point}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                {item.example && (
                  item.example.language ? (
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                    <SyntaxHighlighter language={item.example.content} style={docco}>{item.example.content}</SyntaxHighlighter>
                  </pre>
                  ) : (
                    <SyntaxHighlighter language="plaintext" style={docco}>{item.example.content}</SyntaxHighlighter>
                ))}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex justify-between w-full max-w-3xl mt-4">
        <Button onClick={prevSlide} disabled={currentTopic === 0 && currentSlide === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Precedente
        </Button>
        <Button onClick={nextSlide} disabled={currentTopic === topics.length - 1 && currentSlide === topics[currentTopic].slides.length - 1}>
          Successiva <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default SlideManager;