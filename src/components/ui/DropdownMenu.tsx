import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
    CheckIcon,
    ChevronRightIcon,
    DotFilledIcon,
} from '@radix-ui/react-icons';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 5, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={`glass-card dropdown-content ${className}`}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={`dropdown-item ${inset ? 'pl-8' : ''} ${className}`}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={`dropdown-item dropdown-checkbox-item ${className}`}
        checked={checked}
        {...props}
    >
        <span className="dropdown-checkbox-indicator">
            <DropdownMenuPrimitive.ItemIndicator>
                <CheckIcon />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={`dropdown-item dropdown-radio-item ${className}`}
        {...props}
    >
        <span className="dropdown-radio-indicator">
            <DropdownMenuPrimitive.ItemIndicator>
                <DotFilledIcon className="h-4 w-4 fill-current" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={`dropdown-label ${inset ? 'pl-8' : ''} ${className}`}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={`dropdown-separator ${className}`}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={`dropdown-shortcut ${className}`}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

// Styles embedded for the component
const DropdownStyles = () => (
    <style>{`
        .dropdown-content {
            min-width: 12rem;
            padding: 0.25rem;
            z-index: var(--z-dropdown);
            animation: slideDown var(--transition-fast);
        }

        .dropdown-item {
            position: relative;
            display: flex;
            cursor: pointer;
            user-select: none;
            align-items: center;
            border-radius: var(--radius-sm);
            padding: 0.5rem 0.5rem;
            font-size: 0.875rem;
            outline: none;
            transition: background-color var(--transition-fast), color var(--transition-fast);
            color: var(--text-secondary);
        }

        .dropdown-item:hover, .dropdown-item:focus {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
        }

        .dropdown-item[data-disabled] {
            pointer-events: none;
            opacity: 0.5;
        }

        .dropdown-checkbox-item, .dropdown-radio-item {
            padding-left: 2rem;
        }

        .dropdown-checkbox-indicator, .dropdown-radio-indicator {
            position: absolute;
            left: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1rem;
            height: 1rem;
        }

        .dropdown-label {
            padding: 0.5rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .dropdown-separator {
            height: 1px;
            background-color: var(--glass-border);
            margin: 0.25rem -0.25rem;
        }

        .dropdown-shortcut {
            margin-left: auto;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            opacity: 0.5;
        }
    `}</style>
);

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuRadioGroup,
    DropdownStyles // Add this to layout or component to inject styles
};
