'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

const TOTAL_STEPS = 4;
const stepLabels = [
    { title: 'Create your Team', subtitle: 'Browse and upload' },
    { title: 'Create a Project', subtitle: 'Select and map it' },
    { title: 'Create a Sprint', subtitle: 'Choose the name' },
    { title: 'Create a Task', subtitle: 'Review and confirm' },
];

export function MultiStepForm() {
    const [step, setStep] = useState(0);
    const form = useForm({
        defaultValues: {
            teamName: '',
            managerId: '',
        },
    });

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const onSubmit = (data) => {
        if (step < TOTAL_STEPS - 1) {
            setStep((prev) => prev + 1);
        } else {
            console.log('Final Data:', data);
            toast.success('Team created successfully!');
            form.reset();
            setStep(0);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-7xl bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden border border-border">
                {/* Step Indicator - hidden on small screens */}
                <div className="hidden sm:block sm:w-1/4 border-r border-border h-[800px] overflow-y-auto bg-sidebar text-sidebar-foreground">
                    <div className="px-6 py-8 flex flex-col h-full">
                        <h2 className="font-semibold text-lg">Let&#39;s get you started!</h2>
                        <p className="text-sm text-muted-foreground mb-8">
                            Follow the simple 4 Steps to complete your account.
                        </p>

                        <div className="space-y-6 flex-grow">
                            {stepLabels.map((stepItem, index) => (
                                <div key={index} className="relative pl-6">
                                    {/* Dot and line */}
                                    <div className="absolute left-0 top-0 flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2",
                                                index === step
                                                    ? 'bg-sidebar-primary border-sidebar-primary'
                                                    : index < step
                                                        ? 'bg-sidebar-primary/90 border-sidebar-primary'
                                                        : 'bg-sidebar-accent border-sidebar-border'
                                            )}
                                        />
                                        {index < TOTAL_STEPS - 1 && (
                                            <div className="w-px h-12 bg-sidebar-border mt-1"/>
                                        )}
                                    </div>

                                    {/* Labels */}
                                    <div className="ml-2">
                                        <p
                                            className={cn(
                                                'text-sm font-medium',
                                                index === step
                                                    ? 'text-sidebar-primary'
                                                    : index < step
                                                        ? 'text-sidebar-foreground/70'
                                                        : 'text-sidebar-foreground/50'
                                            )}
                                        >
                                            {stepItem.title}
                                        </p>
                                        <p className="text-xs text-sidebar-foreground/60">{stepItem.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form - full width on small screens */}
                <div className="w-full sm:w-3/4 px-6 sm:px-10 py-8 flex flex-col h-[800px] overflow-y-auto">
                    {/* Mobile step indicator - only visible on small screens */}
                    <div className="block sm:hidden mb-6">
                        <h2 className="font-semibold text-lg mb-2">Step {step + 1} of {TOTAL_STEPS}</h2>
                        <p className="text-sm text-muted-foreground">
                            {stepLabels[step].title}: {stepLabels[step].subtitle}
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                            {/* Content container with top spacing but not stretched */}
                            <div className="space-y-4 mb-4">
                                {step === 0 && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">{stepLabels[0].title}</h3>
                                        <FormField
                                            control={form.control}
                                            name="teamName"
                                            render={({field}) => (
                                                <FormItem className="mb-4">
                                                    <FormLabel>Team Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter team name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="managerId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Team Manager</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select manager"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Alice</SelectItem>
                                                            <SelectItem value="2">Bob</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {/* Mock content for next steps */}
                                {step === 1 && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">{stepLabels[1].title}</h3>
                                        <p>Step 2: Create a Project fields go here</p>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">{stepLabels[2].title}</h3>
                                        <p>Step 3: Create a Sprint fields go here</p>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">{stepLabels[3].title}</h3>
                                        <p>Step 4: Create a Task fields go here</p>
                                    </>
                                )}
                            </div>

                            {/* Push buttons to bottom with mt-auto */}
                            <div className="mt-auto pt-4 border-t border-border">
                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleBack}
                                        disabled={step === 0}
                                    >
                                        Prev
                                    </Button>
                                    <Button type="submit" variant="default">
                                        {step === TOTAL_STEPS - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

/**
 * Team Is created with name and members, managerId
 * */
