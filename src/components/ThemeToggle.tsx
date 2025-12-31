import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from './ThemeProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownStyles,
} from '@/components/ui/DropdownMenu';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <>
            <DropdownStyles />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="btn btn-ghost btn-sm" aria-label="Toggle theme">
                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" style={{ display: theme === 'dark' ? 'none' : 'block' }} />
                        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ display: theme === 'dark' ? 'block' : 'none' }} />
                        <span className="sr-only">Toggle theme</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
