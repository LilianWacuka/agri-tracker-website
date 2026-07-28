import { ExpenseForm } from "@/components/transactions/expenseForm";
import { IncomeForm } from "@/components/transactions/incomeForm";
import { Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function QuickActions(){
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Quick Actions</Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-full max-w-5xl">
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
                    
                    <IncomeForm onSuccess={() => {}} />
                    <ExpenseForm onSuccess={() => {}} />
                    
                </div>
            </PopoverContent>
        </Popover>
    )
}