"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";

export default function TimePayrollIndex() {
	const items = [
		["Timesheets", "/dashboard/business/time-payroll/timesheets"],
		["Approvals", "/dashboard/business/time-payroll/approvals"],
		["Payroll Runs", "/dashboard/business/time-payroll/runs"],
		["Commission Schemes", "/dashboard/business/time-payroll/commissions"],
	];
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time & Payroll</h1>
          <p className="text-muted-foreground">Timesheets, approvals, payroll, commissions</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map(([title, href]) => (
            <Card key={href}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Open</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm">
                  <Link href={href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
