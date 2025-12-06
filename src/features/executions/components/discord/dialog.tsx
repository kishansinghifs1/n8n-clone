"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

const AVAILABLE_MODELS = ['gemini-2.5-flash', 'gemini-2.5-sonnet', 'gemini-2.5-flash-sonnet', 'gemini-2.0-flash', 'gemini-2.0-sonnet', 'gemini-2.0-flash-sonnet'] as const;

const formSchema = z.object({
    variableName: z.string().min(1, { message: "Please enter a variable name" }).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores" }),
    model: z.enum(AVAILABLE_MODELS),
    systemPropmt: z.string().min(1, { message: "Please enter a system prompt" }).optional().or(z.literal("")),
    userPrompt: z.string().min(1, { message: "Please enter a user prompt" }),
    credentialId: z.string().min(1, { message: "Please enter a credential" }),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GeminiFormValues) => void;
    defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<GeminiFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            credentialId: defaultValues.credentialId || "",
            variableName: defaultValues.variableName || "",
            model: defaultValues.model || "gemini-2.5-flash",
            systemPropmt: defaultValues.systemPropmt || "",
            userPrompt: defaultValues.userPrompt || "",
        },
    });

    const { data: credentials, isLoading: isLoadingCredentials } = useCredentialsByType(CredentialType.GEMINI);

    // Reset when opened
    useEffect(() => {
        if (open) {
            form.reset({
                credentialId: defaultValues.credentialId || "",
                variableName: defaultValues.variableName || "",
                model: defaultValues.model || "gemini-2.5-flash",
                systemPropmt: defaultValues.systemPropmt || "",
                userPrompt: defaultValues.userPrompt || "",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: GeminiFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    const watchVariableName = form.watch("variableName") || "apiCall";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6 mt-4"
                    >
                        {/* VARIABLE NAME */}
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="myGemini" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to refrence the result in other nodes: {""}
                                        {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* CREDENTIAL */}
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credential</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoadingCredentials || !credentials?.length}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Place API Key" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.map((credential) => (
                                                <SelectItem key={credential.id} value={credential.id}>
                                                    {credential.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* MODEL */}
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
                                            <SelectItem value="gemini-2.5-sonnet">gemini-2.5-sonnet</SelectItem>
                                            <SelectItem value="gemini-2.5-flash-sonnet">gemini-2.5-flash-sonnet</SelectItem>
                                            <SelectItem value="gemini-2.0-flash">gemini-2.0-flash</SelectItem>
                                            <SelectItem value="gemini-2.0-sonnet">gemini-2.0-sonnet</SelectItem>
                                            <SelectItem value="gemini-2.0-flash-sonnet">gemini-2.0-flash-sonnet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SYSTEM PROMPT */}
                        <FormField
                            control={form.control}
                            name="systemPropmt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="You are a helpful assistant."
                                            className="min-h-[40px] text-sm resize-y placeholder:text-xs"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} for JSON values.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* USER PROMPT */}
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a REST API ?"
                                            className="min-h-[80px] text-sm resize-y placeholder:text-xs"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the prompt to be sent to the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} for JSON values.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* FOOTER */}
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
