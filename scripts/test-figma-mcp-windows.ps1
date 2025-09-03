# PowerShell script to test Figma MCP server connection from Windows
# Run this from Windows PowerShell or Command Prompt

$figmaUrl = "http://127.0.0.1:3845/mcp"

Write-Host "🚀 Testing Figma MCP Server Connection from Windows" -ForegroundColor Green
Write-Host "📍 URL: $figmaUrl" -ForegroundColor Cyan
Write-Host "🔄 Using JSON-RPC 2.0 protocol" -ForegroundColor Cyan
Write-Host ""

# Test 1: Initialize connection
Write-Host "🔌 Step 1: Testing initialize method..." -ForegroundColor Yellow

$initBody = @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{
        protocolVersion = "2024-11-05"
        capabilities = @{
            roots = @{
                listChanged = $true
            }
            sampling = @{}
        }
        clientInfo = @{
            name = "figma-mcp-test"
            version = "1.0.0"
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $initResponse = Invoke-RestMethod -Uri $figmaUrl -Method Post -Body $initBody -ContentType "application/json" -TimeoutSec 10
    
    if ($initResponse.error) {
        Write-Host "⚠️  Initialize error:" -ForegroundColor Red
        Write-Host ($initResponse.error | ConvertTo-Json -Depth 5) -ForegroundColor Red
    } else {
        Write-Host "✅ Initialize successful!" -ForegroundColor Green
        Write-Host "📋 Server capabilities:" -ForegroundColor Cyan
        Write-Host ($initResponse.result | ConvertTo-Json -Depth 5) -ForegroundColor White
    }
} catch {
    Write-Host "❌ Initialize failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure Figma desktop app is running with MCP server enabled" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🛠️  Step 2: Listing available tools..." -ForegroundColor Yellow

# Test 2: List tools
$toolsBody = @{
    jsonrpc = "2.0"
    id = 2
    method = "tools/list"
    params = @{}
} | ConvertTo-Json -Depth 5

try {
    $toolsResponse = Invoke-RestMethod -Uri $figmaUrl -Method Post -Body $toolsBody -ContentType "application/json" -TimeoutSec 10
    
    if ($toolsResponse.error) {
        Write-Host "❌ Tools list error:" -ForegroundColor Red
        Write-Host ($toolsResponse.error | ConvertTo-Json -Depth 5) -ForegroundColor Red
    } elseif ($toolsResponse.result -and $toolsResponse.result.tools) {
        Write-Host "✅ Available Tools Found!" -ForegroundColor Green
        Write-Host ""
        
        $tools = $toolsResponse.result.tools
        Write-Host "📊 Total tools: $($tools.Count)" -ForegroundColor Cyan
        Write-Host ""
        
        for ($i = 0; $i -lt $tools.Count; $i++) {
            $tool = $tools[$i]
            Write-Host "$($i + 1). 🔧 $($tool.name)" -ForegroundColor White
            
            if ($tool.description) {
                Write-Host "   📝 Description: $($tool.description)" -ForegroundColor Gray
            }
            
            if ($tool.inputSchema -and $tool.inputSchema.properties) {
                Write-Host "   📥 Parameters:" -ForegroundColor Gray
                
                foreach ($param in $tool.inputSchema.properties.PSObject.Properties) {
                    $required = if ($tool.inputSchema.required -and $tool.inputSchema.required -contains $param.Name) { " (required)" } else { " (optional)" }
                    $description = if ($param.Value.description) { $param.Value.description } elseif ($param.Value.type) { $param.Value.type } else { "unknown" }
                    Write-Host "      • $($param.Name)$required`: $description" -ForegroundColor DarkGray
                }
            }
            Write-Host ""
        }
        
        # Show summary
        Write-Host "📋 Tool Categories:" -ForegroundColor Cyan
        $categories = @{}
        
        foreach ($tool in $tools) {
            $category = $tool.name.Split('_')[0]
            if (-not $categories.ContainsKey($category)) {
                $categories[$category] = @()
            }
            $categories[$category] += $tool.name
        }
        
        foreach ($category in $categories.Keys) {
            Write-Host "   $category`: $($categories[$category].Count) tools" -ForegroundColor White
        }
        
        # Save results to file
        $outputPath = Join-Path $PSScriptRoot "figma-mcp-tools.json"
        $toolsResponse.result | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding UTF8
        Write-Host ""
        Write-Host "💾 Tools list saved to: $outputPath" -ForegroundColor Green
        
    } else {
        Write-Host "❌ No tools found in response" -ForegroundColor Red
        Write-Host "📄 Full response:" -ForegroundColor Gray
        Write-Host ($toolsResponse | ConvertTo-Json -Depth 5) -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Tools list failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Test completed!" -ForegroundColor Green
