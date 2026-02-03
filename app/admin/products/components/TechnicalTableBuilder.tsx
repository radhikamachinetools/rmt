"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type Header = {
  label: string;
  colSpan?: number;
  rowSpan?: number;
  children?: string[];
  width?: string;
  align?: 'left' | 'center' | 'right';
};

type Row = {
  values: string[];
  height?: string;
};

type TechnicalInformation = {
  tableHeading?: string;
  headers: Header[];
  rows: Row[];
};

type Props = {
  data: TechnicalInformation;
  onChange: (data: TechnicalInformation) => void;
};

export default function TechnicalTableBuilder({ data, onChange }: Props) {
  const [selectedHeader, setSelectedHeader] = useState<number | null>(null);

  const updateTableHeading = (heading: string) => {
    onChange({ ...data, tableHeading: heading });
  };

  const addHeader = () => {
    const newHeader: Header = {
      label: "New Column",
      colSpan: 1,
      align: 'center'
    };
    
    const newData = {
      ...data,
      headers: [...data.headers, newHeader],
      rows: data.rows.map(row => ({
        ...row,
        values: [...row.values, ""]
      }))
    };
    onChange(newData);
  };

  const updateHeader = (index: number, field: keyof Header, value: any) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onChange({ ...data, headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    const newData = {
      headers: data.headers.filter((_, i) => i !== index),
      rows: data.rows.map(row => ({
        ...row,
        values: row.values.filter((_, i) => i !== index)
      }))
    };
    onChange(newData);
  };

  const addChildHeader = (parentIndex: number) => {
    const newHeaders = [...data.headers];
    if (!newHeaders[parentIndex].children) {
      newHeaders[parentIndex].children = [];
    }
    newHeaders[parentIndex].children!.push("Sub Column");
    newHeaders[parentIndex].colSpan = newHeaders[parentIndex].children!.length;
    
    const newData = {
      ...data,
      headers: newHeaders,
      rows: data.rows.map(row => ({
        ...row,
        values: [...row.values, ""]
      }))
    };
    onChange(newData);
  };

  const addRow = () => {
    const totalColumns = data.headers.reduce((sum, header) => sum + (header.colSpan || 1), 0);
    const newRow: Row = {
      values: new Array(totalColumns).fill("")
    };
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const updateRow = (rowIndex: number, field: keyof Row, value: any) => {
    const newRows = [...data.rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
    onChange({ ...data, rows: newRows });
  };

  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex].values[cellIndex] = value;
    onChange({ ...data, rows: newRows });
  };

  const removeRow = (index: number) => {
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== index) });
  };

  const getTotalColumns = () => {
    return data.headers.reduce((sum, header) => {
      if (header.children && header.children.length > 0) {
        return sum + header.children.length;
      }
      return sum + (header.colSpan || 1);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Table Heading</label>
          <input
            type="text"
            value={data.tableHeading || ''}
            onChange={(e) => updateTableHeading(e.target.value)}
            placeholder="Enter table heading (e.g., Technical Information)"
            className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-brand-green"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addHeader}
              className="flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm"
            >
              <Plus size={14} />
              Add Column
            </button>
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm"
            >
              <Plus size={14} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      {/* Header Configuration */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Column Headers</h4>
        {data.headers.map((header, headerIndex) => (
          <div key={headerIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-700">Column {headerIndex + 1}</span>
              <button
                type="button"
                onClick={() => removeHeader(headerIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Header Label</label>
                <input
                  type="text"
                  value={header.label}
                  onChange={(e) => updateHeader(headerIndex, 'label', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                <select
                  value={header.align || 'center'}
                  onChange={(e) => updateHeader(headerIndex, 'align', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Column Span</label>
                <input
                  type="number"
                  min="1"
                  value={header.colSpan || 1}
                  onChange={(e) => updateHeader(headerIndex, 'colSpan', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green"
                />
              </div>
            </div>

            {/* Sub Headers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">Sub Headers</label>
                <button
                  type="button"
                  onClick={() => addChildHeader(headerIndex)}
                  className="text-brand-green hover:text-brand-green-dark text-xs"
                >
                  <Plus size={12} className="inline mr-1" />
                  Add Sub Header
                </button>
              </div>
              
              {header.children && header.children.map((child, childIndex) => (
                <div key={childIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={child}
                    onChange={(e) => {
                      const newChildren = [...(header.children || [])];
                      newChildren[childIndex] = e.target.value;
                      updateHeader(headerIndex, 'children', newChildren);
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green"
                    placeholder="Sub header name"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newChildren = header.children!.filter((_, i) => i !== childIndex);
                      const newHeaders = [...data.headers];
                      if (newChildren.length === 0) {
                        newHeaders[headerIndex] = { ...newHeaders[headerIndex], children: undefined, colSpan: 1 };
                      } else {
                        newHeaders[headerIndex] = { ...newHeaders[headerIndex], children: newChildren, colSpan: newChildren.length };
                      }
                      
                      // Remove corresponding column from all rows
                      let columnIndexToRemove = 0;
                      for (let i = 0; i < headerIndex; i++) {
                        columnIndexToRemove += data.headers[i].colSpan || 1;
                      }
                      columnIndexToRemove += childIndex;
                      
                      const newRows = data.rows.map(row => ({
                        ...row,
                        values: row.values.filter((_, i) => i !== columnIndexToRemove)
                      }));
                      
                      onChange({ headers: newHeaders, rows: newRows });
                    }}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table Preview */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Table Preview & Data Entry</h4>
        
        {data.headers.length > 0 && (
          <div className="overflow-x-auto border border-gray-300 rounded">
            <table className="w-full border-collapse">
              <thead>
                {/* Main Headers */}
                <tr className="bg-teal-700">
                  {data.headers.map((header, index) => (
                    <th
                      key={index}
                      colSpan={header.colSpan || 1}
                      className={`px-4 py-3 text-white font-bold border border-gray-400 text-${header.align || 'center'}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
                
                {/* Sub Headers */}
                {data.headers.some(h => h.children) && (
                  <tr className="bg-teal-600">
                    {data.headers.map((header, headerIndex) => 
                      header.children ? header.children.map((child, childIndex) => (
                        <th
                          key={`${headerIndex}-${childIndex}`}
                          className="px-4 py-2 text-white font-semibold border border-gray-400 text-center text-sm"
                        >
                          {child}
                        </th>
                      )) : (
                        <th key={headerIndex} className="px-4 py-2 text-white font-semibold border border-gray-400"></th>
                      )
                    )}
                  </tr>
                )}
              </thead>
              
              <tbody>
                {data.rows.map((row, rowIndex) => {
                  const expectedColumns = data.headers.reduce((sum, header) => {
                    if (header.children && header.children.length > 0) {
                      return sum + header.children.length;
                    }
                    return sum + (header.colSpan || 1);
                  }, 0);
                  
                  return (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.values.slice(0, expectedColumns).map((value, valueIndex) => (
                        <td key={valueIndex} className="px-4 py-3 border border-gray-400">
                          <textarea
                            value={value}
                            onChange={(e) => updateCell(rowIndex, valueIndex, e.target.value)}
                            className="w-full px-2 py-1 text-sm border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-green rounded resize-none"
                            rows={value ? Math.max(1, value.split('\n').length) : 1}
                            placeholder="Enter value"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 border border-gray-400">
                        <button
                          type="button"
                          onClick={() => removeRow(rowIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {data.headers.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No columns created yet</p>
            <button
              type="button"
              onClick={addHeader}
              className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark mx-auto"
            >
              <Plus size={16} />
              Create First Column
            </button>
          </div>
        )}
      </div>
    </div>
  );
}