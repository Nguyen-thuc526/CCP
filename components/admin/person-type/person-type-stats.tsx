import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Category } from "@/types/category"
import { PersonType } from "@/types/person-type"

interface PersonalityStatsProps {
  categories: Category[]
  personTypes: PersonType[]
}

export function PersonalityStats({ categories, personTypes }: PersonalityStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const count = personTypes.filter((p) => p.categoryId === category.id).length
        return (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              <Badge variant="secondary">{count}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">loại tính cách</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
