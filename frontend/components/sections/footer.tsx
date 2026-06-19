'use client'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-background font-bold">
                ✦
              </div>
              <span className="text-lg font-bold">BidCraft</span>
            </div>
            <p className="text-sm opacity-75">
              The premier marketplace for creators. Buy unique handmade items with confidence.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">All Items</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Auctions</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Collections</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Categories</a></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Start Selling</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Pricing</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Creator Guides</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Seller Dashboard</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Blog</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
            <p>&copy; 2024 BidCraft. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
