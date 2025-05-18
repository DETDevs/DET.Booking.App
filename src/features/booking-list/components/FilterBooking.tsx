"use client";
import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, InputAdornment } from "@mui/material";
import { RotateCcw, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";

export interface Filters {
  startDate?: Date;
  endDate?: Date;
  status: string;
  search: string;
}

interface Props {
  onFilterChange: (f: Filters) => void;
}

export default function FilterBooking({ onFilterChange }: Props) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  useEffect(() => {
    onFilterChange({ startDate, endDate, status, search });
  }, [startDate, endDate, status, search]);

  const reset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus("");
    setSearch("");
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <TextField
              size="small"
              label="Date Start"
              className="w-[7rem]"
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
              InputProps={{
                readOnly: true,
                onClick: () => setOpenStart(true),
              }}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-2">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(d) => {
                setStartDate(d);
                setOpenStart(false);
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <TextField
              size="small"
              label="Date End"
              className="w-[7rem]"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
              InputProps={{
                readOnly: true,
                onClick: () => setOpenEnd(true),
              }}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-2">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(d) => {
                setEndDate(d);
                setOpenEnd(false);
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[10rem]"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>

        <Button
          startIcon={<RotateCcw />}
          color="error"
          variant="outlined"
          onClick={reset}
        >
          Reset
        </Button>
      </div>

      <TextField
        size="small"
        placeholder="Search patient, doctor, service…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
          style: { borderRadius: 20 },
        }}
      />
    </div>
  );
}
