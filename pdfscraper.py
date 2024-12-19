import tkinter as tk
from tkinter import messagebox, filedialog
import requests
from bs4 import BeautifulSoup
from fpdf import FPDF
import threading

class WebScrapingTool:
    def __init__(self, root):
        self.root = root
        self.root.title("Web Scraping to PDF Tool")
        
        # GUI Elements
        tk.Label(root, text="スクレイピング先URL:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
        self.url_entry = tk.Entry(root, width=50)
        self.url_entry.grid(row=0, column=1, padx=10, pady=5)
        
        tk.Label(root, text="この文字を含む行:").grid(row=1, column=0, padx=10, pady=5, sticky="w")
        self.keyword_entry = tk.Entry(root, width=50)
        self.keyword_entry.grid(row=1, column=1, padx=10, pady=5)
        
        tk.Label(root, text="出力先ファイル名:").grid(row=2, column=0, padx=10, pady=5, sticky="w")
        self.output_entry = tk.Entry(root, width=50)
        self.output_entry.grid(row=2, column=1, padx=10, pady=5)
        
        self.start_button = tk.Button(root, text="スタート", command=self.start_scraping, bg="green", fg="white")
        self.start_button.grid(row=3, column=0, padx=10, pady=10)
        
        self.stop_button = tk.Button(root, text="ストップ", command=self.stop_scraping, bg="red", fg="white", state="disabled")
        self.stop_button.grid(row=3, column=1, padx=10, pady=10)
        
        # Thread control
        self.running = False
        self.scraping_thread = None

    def start_scraping(self):
        url = self.url_entry.get()
        keyword = self.keyword_entry.get()
        output_file = self.output_entry.get()
        
        if not url or not keyword or not output_file:
            messagebox.showerror("エラー", "全ての入力欄を埋めてください。")
            return
        
        self.running = True
        self.start_button.config(state="disabled")
        self.stop_button.config(state="normal")
        
        # Start the scraping process in a separate thread
        self.scraping_thread = threading.Thread(target=self.scrape_data, args=(url, keyword, output_file))
        self.scraping_thread.start()

    def stop_scraping(self):
        self.running = False
        messagebox.showinfo("情報", "スクレイピングを停止しました。")

    def scrape_data(self, url, keyword, output_file):
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract lines containing the keyword
            lines = []
            for element in soup.stripped_strings:
                if keyword in element and self.running:
                    lines.append(element)
            
            if not lines:
                messagebox.showinfo("情報", "指定した文字を含む行が見つかりませんでした。")
            else:
                self.generate_pdf(lines, output_file)
                messagebox.showinfo("成功", f"PDFを生成しました: {output_file}")
        
        except Exception as e:
            messagebox.showerror("エラー", f"エラーが発生しました: {str(e)}")
        
        finally:
            self.running = False
            self.start_button.config(state="normal")
            self.stop_button.config(state="disabled")

    def generate_pdf(self, lines, output_file):
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        for line in lines:
            pdf.cell(0, 10, txt=line, ln=True)
        
        pdf.output(output_file)

def main():
    root = tk.Tk()
    app = WebScrapingTool(root)
    root.mainloop()

if __name__ == "__main__":
    main()
