"use client";

import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const orders = [
  { id: "#1042", customer: "Marko Petrović", total: "€49,00", status: "Završeno", tone: "bg-success-bg text-success" },
  { id: "#1041", customer: "Ana Jovanović", total: "€120,50", status: "Na čekanju", tone: "bg-warning-bg text-warning" },
  { id: "#1040", customer: "Ivan Nikolić", total: "€15,90", status: "Otkazano", tone: "bg-danger-bg text-danger" },
];

export function ComponentsDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Dugmad</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => toast.success("Sync završen", { description: "Učitano 24 porudžbine." })}>
            <RefreshCw /> Sinhronizuj
          </Button>
          <Button variant="secondary">Sekundarno</Button>
          <Button variant="outline">Okvir</Button>
          <Button variant="ghost">Bez pozadine</Button>
          <Button variant="destructive">
            <Trash2 /> Obriši
          </Button>
          <Button variant="link">Link</Button>
          <Button disabled>Isključeno</Button>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Kartice i oznake</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="card-hover">
            <CardHeader>
              <CardDescription className="text-label">Prihod danas</CardDescription>
              <CardTitle className="text-kpi">€12.480</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-success">+12,4%</span>{" "}
              <span className="text-muted-foreground">prema juče</span>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardDescription className="text-label">Porudžbine</CardDescription>
              <CardTitle className="text-kpi">86</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-danger">−3,1%</span>{" "}
              <span className="text-muted-foreground">prema juče</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-label">Učitavanje</CardDescription>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Podrazumevano</Badge>
          <Badge variant="secondary">Sekundarno</Badge>
          <Badge variant="outline">Okvir</Badge>
          <Badge className="bg-success-bg text-success">Završeno</Badge>
          <Badge className="bg-warning-bg text-warning">Na čekanju</Badge>
          <Badge className="bg-danger-bg text-danger">Otkazano</Badge>
          <Badge className="bg-neutral-bg text-neutral">Nova</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Forma</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email kupca</Label>
            <Input id="email" type="email" placeholder="kupac@primer.rs" />
          </div>
          <div className="space-y-2">
            <Label>Period</Label>
            <Select defaultValue="7d">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Izaberi period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Danas</SelectItem>
                <SelectItem value="7d">7 dana</SelectItem>
                <SelectItem value="30d">30 dana</SelectItem>
                <SelectItem value="month">Ovaj mesec</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="sound" defaultChecked />
            <Label htmlFor="sound">Zvuk za nove porudžbine</Label>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Prozori i meniji</p>
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Obriši sajt…</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Obriši sajt?</DialogTitle>
                <DialogDescription>
                  Sajt „Test shop“ i sva njegova podešavanja biće obrisani. Ovo ne može da se poništi.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Otkaži</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => toast.error("Sajt obrisan")}>
                    Obriši
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Detalji porudžbine</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Porudžbina #1042</SheetTitle>
                <SheetDescription>Marko Petrović · danas u 14:32</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 px-4">
                <Separator />
                <div className="flex justify-between">
                  <span>Ukupno</span>
                  <span className="text-card-title">€49,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Neto profit</span>
                  <span className="text-card-title text-success">€21,30</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Opcije">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sajt</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Izmeni</DropdownMenuItem>
              <DropdownMenuItem>Sinhronizuj</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Obriši</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Webhook adresa</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-card-title">Kopiraj u WooCommerce</p>
              <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                https://orderly.vercel.app/api/webhook/woo/abc123
              </p>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar>
                <AvatarFallback>NS</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>Admin</TooltipContent>
          </Tooltip>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Kartice (tabs) i tabela</p>
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="overview">Pregled</TabsTrigger>
            <TabsTrigger value="orders">Porudžbine</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-muted-foreground">
            Ovde će biti KPI i grafici.
          </TabsContent>
          <TabsContent value="orders">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broj</TableHead>
                    <TableHead>Kupac</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Iznos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono">{o.id}</TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>
                        <Badge className={o.tone}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{o.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
