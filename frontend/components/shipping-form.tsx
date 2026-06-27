import React from 'react';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingFormProps {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
  disabled?: boolean;
}

export function ShippingForm({ value, onChange, disabled }: ShippingFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Shipping Address</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={value.fullName}
            onChange={handleChange}
            disabled={disabled}
            required
            className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={value.addressLine1}
            onChange={handleChange}
            disabled={disabled}
            required
            className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Address Line 2 (Optional)</label>
          <input
            type="text"
            name="addressLine2"
            value={value.addressLine2 || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">City</label>
            <input
              type="text"
              name="city"
              value={value.city}
              onChange={handleChange}
              disabled={disabled}
              required
              className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">State / Province</label>
            <input
              type="text"
              name="state"
              value={value.state}
              onChange={handleChange}
              disabled={disabled}
              required
              className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={value.postalCode}
              onChange={handleChange}
              disabled={disabled}
              required
              className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={value.country}
              onChange={handleChange}
              disabled={disabled}
              required
              className="w-full px-4 py-2 bg-muted text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
