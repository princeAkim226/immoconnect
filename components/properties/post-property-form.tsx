"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cities, propertyTypes, amenities } from "@/lib/constants/locations"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropertyType, PropertyFormData } from "@/types/property"
import { useProperties } from "@/lib/hooks/use-properties"
import { useToast } from "@/components/ui/use-toast"

const propertyTypeEnum = z.enum(['apartment', 'house', 'studio', 'villa', 'office', 'land'])

const formSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  description: z.string().min(20, "La description doit faire au moins 20 caractères"),
  type: propertyTypeEnum,
  city: z.string().min(1, "La ville est requise"),
  district: z.string().optional(),
  price: z.number().min(10000, "Le prix minimum est de 10,000 FCFA"),
  surface: z.number().min(1, "La surface doit être positive"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  features: z.array(z.string()).default([]),
  images: z.instanceof(FileList).optional()
})

type FormValues = z.infer<typeof formSchema>

export function PostPropertyForm() {
  const { createProperty } = useProperties()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "apartment" as PropertyType,
      city: "",
      district: "",
      price: 50000,
      surface: 0,
      features: [],
    }
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      await createProperty(values as PropertyFormData)

      toast({
        title: "Propriété publiée",
        description: "Votre annonce a été publiée avec succès",
      })

      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'annonce</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Villa moderne à Ouaga 2000" {...field} />
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
                  placeholder="Décrivez votre bien en détail..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de bien</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix mensuel (FCFA)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={10000} 
                    step={5000} 
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surface"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface (m²)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Commodités disponibles</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((item) => (
              <FormField
                key={item.value}
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.value)}
                        onCheckedChange={(checked) => {
                          const values = field.value || []
                          if (checked) {
                            field.onChange([...values, item.value])
                          } else {
                            field.onChange(values.filter((v) => v !== item.value))
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos du bien</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                    if (files?.length) {
                      field.onChange(files)
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Ajoutez jusqu'à 10 photos de votre bien
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
        </Button>
      </form>
    </Form>
  )
}