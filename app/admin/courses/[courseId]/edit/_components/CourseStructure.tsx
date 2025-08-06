"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import {CSS} from '@dnd-kit/utilities';
import { AdminCourseType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { listeners } from "process";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FileTextIcon, GripVertical, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
    data: AdminCourseType
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson';
        chapterId?: string; // Only required for lessons 
    }
}


export function CourseStructure({ data }: Props) {

    const initialItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true, //default state for each chapter is open
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        }))
    }));

    const [items, setItems]= useState(initialItems);

    function SortableItem({ id, children, className, data }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({id: id, data: data});
        
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };
        
        return (
            <div ref={setNodeRef} style={style} {...attributes} 
            className={cn("touch-none", className, isDragging ? "z-10" : "")}>
                {children(listeners)}
            </div>
        );
        }

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
        setItems((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            
            return arrayMove(items, oldIndex, newIndex);
        });
        }
    }

    function toggleChapter(chapterId: string) {
        setItems(
            items.map((chapter) => 
                chapter.id === chapterId 
                ? {...chapter, isOpen: !chapter.isOpen} 
                : chapter
            )
        )
    }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
    );
    return (
        <DndContext 
        collisionDetection={rectIntersection} 
        onDragEnd={handleDragEnd}
        sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                    <SortableContext 
                    strategy={verticalListSortingStrategy} 
                    items={items}
                    >

                       {items.map((item) => (
                            <SortableItem id={item.id} data={{type: 'chapter'}} key={item.id}>
                                {(listeners) => (
                                    <Card>
                                        <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                        <div className="flex item-center justify-between p-3 border-b border-border">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                size="icon"
                                                variant="ghost" 
                                                {...listeners}>
                                                   <GripVertical className="size-4" />
                                                </Button>
                                                <CollapsibleTrigger asChild>
                                                    <Button 
                                                    size="icon"
                                                    variant="ghost"
                                                    className="flex items-center">
                                                        {
                                                            item.isOpen ? (
                                                                <ChevronDown className="size-4" />
                                                            ) : (
                                                                <ChevronUp className="size-4" />
                                                            )
                                                        }
                                                    </Button>
                                                </CollapsibleTrigger>

                                                <p className="cursor-pointer hover:text-primary pl-2">{item.title}</p>
                                            </div>
                                            <Button size="icon" variant="outline">
                                                <Trash2Icon className="size-4" />
                                            </Button>
                                        </div>
                                        <CollapsibleContent>
                                            <div className="p-1">
                                                <SortableContext items={item.lessons.map((lesson) => lesson.id)}
                                                strategy={verticalListSortingStrategy}   
                                                >
                                                    {item.lessons.map((lesson) =>  (
                                                        <SortableItem key={lesson.id} id={lesson.id} data={{type: 'lesson', chapterId: item.id}}>
                                                            {
                                                                (lessonListeners) => (
                                                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                        size="icon"
                                                                        variant="ghost" 
                                                                        {...lessonListeners}>
                                                                            <GripVertical className="size-4" />
                                                                        </Button>
                                                                        <FileTextIcon className="size-4" />
                                                                    <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>
                                                                        {lesson.title}
                                                                    </Link>
                                                                    </div>
                                                                    <Button size="icon" variant="outline">
                                                                        <Trash2Icon className="size-4" />
                                                                    </Button>
                                                                  </div>  
                                                                )
                                                            }
                                                        </SortableItem>
                                                    ))}
                                                </SortableContext>
                                                <Button className="w-full p-2" variant="outline">
                                                    Add Lesson
                                                </Button>
                                            </div>
                                        </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                       ))} 
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}