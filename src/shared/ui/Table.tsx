import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

export interface Data {
  [key: string]: any;
}

interface Props {
  columns: readonly Column[];
  rows: Data[];
}

export default function StickyHeadTable({ columns, rows }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isDark =
    document.documentElement.querySelector(".dark") !== null ||
    document.querySelector(".dark") !== null;

  const bg = isDark ? "#262626" : "#fff";
  const bgHead = isDark ? "#333" : "#fafafa";
  const textColor = isDark ? "#e5e5e5" : "inherit";
  const borderColor = isDark ? "#404040" : "#e5e7eb";

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: bg,
        borderRadius: "1rem",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
      }}
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={c.id}
                  align={c.align}
                  style={{
                    minWidth: c.minWidth,
                    backgroundColor: bgHead,
                    color: isDark ? "#a3a3a3" : "#6b7280",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  {c.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow
                  hover
                  key={idx}
                  sx={{
                    "&:hover": {
                      backgroundColor: isDark
                        ? "#333 !important"
                        : "#f9fafb !important",
                    },
                    "& td": { borderBottom: `1px solid ${borderColor}` },
                  }}
                >
                  {columns.map((c) => {
                    const value = row[c.id];
                    return (
                      <TableCell
                        key={c.id}
                        align={c.align}
                        sx={{ color: textColor, fontSize: "0.875rem" }}
                      >
                        {c.format ? c.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
        sx={{
          color: textColor,
          borderTop: `1px solid ${borderColor}`,
          "& .MuiTablePagination-selectIcon": { color: textColor },
          "& .MuiIconButton-root": { color: textColor },
        }}
      />
    </Paper>
  );
}
