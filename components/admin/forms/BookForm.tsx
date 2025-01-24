"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "@/components/admin/ColorPicker";
import { createBook, updateBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";

interface Props extends Partial<Book> {
  type?: "create" | "update" | "delete";
}

const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();

  let selectedBooks = book as Book[];

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: !selectedBooks[0]
      ? {
          title: "",
          description: "",
          author: "",
          genre: "",
          rating: 1,
          totalCopies: 1,
          coverUrl: "",
          coverColor: "",
          videoUrl: "",
          summary: "",
        }
      : {
          title: selectedBooks[0].title,
          description: selectedBooks[0].description,
          author: selectedBooks[0].author,
          genre: selectedBooks[0].genre,
          rating: selectedBooks[0].rating as number,
          totalCopies: selectedBooks[0].totalCopies,
          coverUrl: selectedBooks[0].coverUrl,
          coverColor: selectedBooks[0].coverColor,
          videoUrl: selectedBooks[0].videoUrl,
          summary: selectedBooks[0].summary,
        },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    if (type === "create") {
      const result = await createBook(values);
      if (result.success) {
        toast({
          title: "Success",
          description: "Book created successfully.",
        });

        router.push(`/admin/books/`);
      } else {
        toast({
          title: "Error",
          description: `Book was not created. ${result.message}`,
          variant: "destructive",
        });
      }
    } else {
      const result = await updateBook(values, selectedBooks[0].id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Book updated successfully.",
        });

        router.push(`/admin/books/`);
      } else {
        toast({
          title: "Error",
          description: `Book was not created. ${result.message}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Book Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder={"Book title"}
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"author"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Author
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder={"Book author"}
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"genre"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Genre
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder={"Book genre"}
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type={"float"}
                  min={1}
                  max={5}
                  required
                  placeholder={"Book rating"}
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"totalCopies"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Total Copies
              </FormLabel>
              <FormControl>
                <Input
                  type={"number"}
                  min={1}
                  max={10000}
                  required
                  placeholder={"Total copies"}
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverUrl"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Book Image
              </FormLabel>
              <FormControl>
                <FileUpload
                  type={"image"}
                  accept={"image/*"}
                  placeholder={"Upload a book cover"}
                  folder={"books/cover"}
                  variant={"light"}
                  onFileChange={field.onChange}
                  value={
                    selectedBooks[0] ? selectedBooks[0].coverUrl : field.value
                  }
                ></FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverColor"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Primary Color
              </FormLabel>
              <FormControl>
                <ColorPicker
                  value={
                    type === "update"
                      ? selectedBooks[0].coverColor
                      : field.value
                  }
                  onPickerChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Book Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={"Book Description"}
                  {...field}
                  rows={10}
                  className={"book-form_input"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"videoUrl"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Book Trailer
              </FormLabel>
              <FormControl>
                <FileUpload
                  type={"video"}
                  accept={"video/*"}
                  placeholder={"Upload a book trailer"}
                  folder={"books/videos"}
                  variant={"light"}
                  onFileChange={field.onChange}
                  value={
                    selectedBooks[0] ? selectedBooks[0].videoUrl : field.value
                  }
                ></FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"summary"}
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel className="text-base font-normal text-dark-500">
                Book Summary
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={"Book Summary"}
                  {...field}
                  rows={5}
                  className={"book-form_input"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={"book-form_btn text-white"}>
          {type === "update" ? "Update Book In Library" : "Add Book to Library"}
        </Button>
      </form>
    </Form>
  );
};
export default BookForm;
