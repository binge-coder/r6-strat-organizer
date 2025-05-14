"use client";

import OperatorIcon from "@/components/OperatorIcon";
import { useFilter } from "@/components/context/FilterContext";
import { useUser } from "@/components/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MAPS from "@/data/maps";
import DEFENDERS from "@/data/operator";
import { createStrat } from "@/src/actions/strats";
import { createNewDrawing } from "@/src/excalidraw";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  map: z.string().min(1, "Map is required"),
  site: z.string().min(1, "Site is required"),
  name: z.string().optional(),
  description: z.string().optional(),
  drawingID: z.string().optional(), // We'll generate this automatically
  powerOPs: z.array(z.string()),
});

export function CreateStratDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { refreshStrats } = useFilter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      map: "",
      site: "",
      name: "",
      description: "",
      powerOPs: [],
    },
  });

  const selectedMap = form.watch("map");
  const selectedSites =
    MAPS.find((map) => map.name === selectedMap)?.sites ?? [];
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Create a new Excalidraw drawing
      const drawingID = await createNewDrawing();

      const result = await createStrat({
        name: "",
        description: "",
        ...values,
        teamID: user?.teamID!,
        drawingID,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setOpen(false);
      form.reset();
      await refreshStrats();
      toast.success("Strat created successfully");
    } catch (error) {
      console.error("Error creating strat:", error);
      toast.error("Failed to create strat");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Strat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Strat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a map" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MAPS.map((map) => (
                        <SelectItem key={map.name} value={map.name}>
                          {map.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedMap}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            selectedMap ? "Select a site" : "Select a map first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedSites.map((site) => (
                        <SelectItem key={site} value={site}>
                          {site}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter strat name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter strat description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {/* Drawing ID field removed as we now generate it automatically with Excalidraw */}
            <FormField
              control={form.control}
              name="powerOPs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Operators</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-start"
                        >
                          {field.value.length > 0
                            ? field.value
                                .map((op) =>
                                  DEFENDERS.find((o) => o.name === op)
                                )
                                .filter(Boolean)
                                .map((op) => (
                                  <OperatorIcon key={op!.name} op={op!} />
                                ))
                            : "Select power operators"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search operators..." />
                        <CommandList>
                          <CommandEmpty>No operators found.</CommandEmpty>
                          <CommandGroup>
                            {DEFENDERS.map((op) => (
                              <CommandItem
                                key={op.name}
                                onSelect={() => {
                                  const newValue = field.value.includes(op.name)
                                    ? field.value.filter(
                                        (value) => value !== op.name
                                      )
                                    : [...field.value, op.name];
                                  field.onChange(newValue);
                                }}
                              >
                                <OperatorIcon op={op} />
                                {op.name}
                                {field.value.includes(op.name) && (
                                  <span className="ml-auto">✓</span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Strat
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
